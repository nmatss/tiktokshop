import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import {
  PAYMENT_CONFIRMED_EVENTS,
  PAYMENT_REFUNDED_EVENT,
  mapAsaasStatus,
  type AsaasWebhookPayload,
} from '@/lib/asaas'
import { validateWebhookToken, safeLog, checkRateLimit } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(`webhook:${clientIP}`, 100, 60000)) {
      console.error('[Webhook] Rate limit exceeded for IP:', clientIP)
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Validate webhook token
    const isValid = await validateWebhookToken()
    if (!isValid) {
      console.error('[Webhook] Invalid token')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: AsaasWebhookPayload = await request.json()
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

    // Find existing payment in our database
    const { data: existingPayment, error: findError } = await supabase
      .from('payments')
      .select('*')
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

      // Check if entitlement already exists
      const { data: existingEntitlement } = await supabase
        .from('entitlements')
        .select('*')
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
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
