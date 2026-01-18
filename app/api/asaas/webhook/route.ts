import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import {
  PAYMENT_CONFIRMED_EVENTS,
  PAYMENT_REFUNDED_EVENT,
  mapAsaasStatus,
  type AsaasWebhookPayload,
} from '@/lib/asaas'
import { validateWebhookToken, safeLog, checkRateLimit } from '@/lib/security'
import { notifyNewEnrollment, getTelegramInviteLink } from '@/lib/telegram'
import crypto from 'crypto'

// Response type interfaces
interface WebhookSuccessResponse {
  status: 'ok'
  message?: string
}

interface ErrorResponse {
  error: string
}

type WebhookResponse = WebhookSuccessResponse | ErrorResponse

/**
 * Validates the webhook signature from Asaas.
 * Asaas sends a signature in the 'asaas-signature' header that is an HMAC-SHA256
 * of the raw request body using the webhook secret as the key.
 *
 * @param request - The incoming webhook request
 * @param rawBody - The raw request body as a string (needed for signature verification)
 * @returns true if signature is valid, false otherwise
 */
async function validateWebhookSignature(
  request: NextRequest,
  rawBody: string
): Promise<boolean> {
  const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET

  // If no webhook secret is configured, fall back to token validation
  // Log a warning as signature validation is preferred for enhanced security
  if (!webhookSecret) {
    console.warn('[Webhook] ASAAS_WEBHOOK_SECRET not configured. Using token validation only. Configure signature validation for enhanced security.')
    return validateWebhookToken()
  }

  const signature = request.headers.get('asaas-signature')

  if (!signature) {
    console.error('[Webhook] No signature provided in request')
    return false
  }

  try {
    // Compute expected signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('hex')

    // Timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (signatureBuffer.length !== expectedBuffer.length) {
      console.error('[Webhook] Signature length mismatch')
      return false
    }

    const isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer)

    if (!isValid) {
      console.error('[Webhook] Signature verification failed')
    }

    return isValid
  } catch (error) {
    console.error('[Webhook] Error validating signature:', error)
    return false
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<WebhookResponse>> {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(`webhook:${clientIP}`, 100, 60000)) {
      console.error('[Webhook] Rate limit exceeded for IP:', clientIP)
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Read raw body for signature validation (must be done before parsing JSON)
    const rawBody = await request.text()

    // Validate webhook signature (preferred) or fall back to token validation
    const isSignatureValid = await validateWebhookSignature(request, rawBody)
    if (!isSignatureValid) {
      // Also try token validation as fallback for backward compatibility
      const isTokenValid = await validateWebhookToken()
      if (!isTokenValid) {
        console.error('[Webhook] Invalid signature and token')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Parse the body after validation
    let body: AsaasWebhookPayload
    try {
      body = JSON.parse(rawBody)
    } catch {
      console.error('[Webhook] Invalid JSON payload')
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { event, payment } = body

    safeLog('Webhook received', {
      event,
      paymentId: payment?.id,
      status: payment?.status,
    })

    if (!event || !payment) {
      console.error('[Webhook] Invalid payload')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find existing payment in our database (only needed columns)
    const { data: existingPayment, error: findError } = await supabase
      .from('payments')
      .select('id, user_id, course_id, status')
      .eq('asaas_payment_id', payment.id)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      // PGRST116 = no rows found
      console.error('[Webhook] Error finding payment:', findError.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Map Asaas status to our status
    const newStatus = mapAsaasStatus(payment.status)

    // If payment doesn't exist in our DB, we might have a reference
    // Try to parse externalReference for user/course info
    let userId: string | null = existingPayment?.user_id || null
    let courseId: string | null = existingPayment?.course_id || null

    if (!existingPayment && payment.externalReference) {
      try {
        const ref = JSON.parse(payment.externalReference)
        userId = ref.userId
        courseId = ref.courseId
      } catch {
        console.error('[Webhook] Could not parse externalReference')
      }
    }

    // Idempotency check - if same status, skip processing
    if (existingPayment && existingPayment.status === newStatus) {
      safeLog('Webhook skipped (idempotent)', {
        paymentId: payment.id,
        status: newStatus,
      })
      return NextResponse.json({ status: 'ok', message: 'Already processed' })
    }

    // Update or create payment record
    if (existingPayment) {
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', existingPayment.id)

      if (updateError) {
        console.error('[Webhook] Error updating payment:', updateError.message)
      }
    } else if (userId && courseId) {
      // Create payment record if we have user and course info
      await supabase.from('payments').insert({
        user_id: userId,
        course_id: courseId,
        asaas_payment_id: payment.id,
        asaas_customer_id: payment.customer,
        status: newStatus,
        value_cents: Math.round(payment.value * 100),
        billing_type: payment.billingType,
      })
    }

    // Handle payment confirmation - activate entitlement
    // IMPORTANT: Only activate on CONFIRMED/RECEIVED, never on CREATED
    if (PAYMENT_CONFIRMED_EVENTS.includes(event) && userId && courseId) {
      safeLog('Activating entitlement', { userId, courseId, event })

      // Check if entitlement already exists (only need id)
      const { data: existingEntitlement } = await supabase
        .from('entitlements')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (existingEntitlement) {
        // Update to active
        await supabase
          .from('entitlements')
          .update({
            status: 'active',
            activated_at: new Date().toISOString(),
          })
          .eq('id', existingEntitlement.id)
      } else {
        // Create new entitlement
        await supabase.from('entitlements').insert({
          user_id: userId,
          course_id: courseId,
          status: 'active',
          activated_at: new Date().toISOString(),
          expires_at: null, // Lifetime access
        })
      }

      safeLog('Entitlement activated', { userId, courseId })

      // Get user and course info for notification
      const { data: userData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', userId)
        .single()

      const { data: courseData } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single()

      // Notify about new enrollment (optional - only if configured)
      if (userData?.name && courseData?.title) {
        await notifyNewEnrollment(userData.name, courseData.title)
      }

      // Log Telegram invite link for reference
      const telegramLink = getTelegramInviteLink()
      if (telegramLink) {
        safeLog('Telegram invite available', { link: telegramLink })
      }
    }

    // Handle refund - deactivate entitlement
    if (event === PAYMENT_REFUNDED_EVENT && userId && courseId) {
      safeLog('Deactivating entitlement (refund)', { userId, courseId })

      await supabase
        .from('entitlements')
        .update({ status: 'inactive' })
        .eq('user_id', userId)
        .eq('course_id', courseId)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Allow only POST
export async function GET(): Promise<NextResponse<ErrorResponse>> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
