import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getAsaasClient } from '@/lib/asaas'
import { isValidEmail, isValidCPF, sanitizeInput, safeLog, checkRateLimit } from '@/lib/security'

// Response type interfaces
interface CheckoutSuccessResponse {
  paymentId: string
  paymentUrl: string
  bankSlipUrl?: string
  pixQrCode?: string
  pixCopiaECola?: string
  status: string
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
}

interface ErrorResponse {
  error: string
}

type CheckoutResponse = CheckoutSuccessResponse | ErrorResponse

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(`checkout:${clientIP}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde um momento.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, cpf, paymentMethod = 'pix' } = body

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = email.toLowerCase().trim()

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const sanitizedCPF = cpf ? cpf.replace(/\D/g, '') : undefined
    if (sanitizedCPF && !isValidCPF(sanitizedCPF)) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      )
    }

    // Race condition protection: prevent duplicate submissions for the same email
    // This uses a stricter rate limit (1 request per 5 seconds per email)
    // to prevent race conditions when the same email submits twice quickly
    if (!checkRateLimit(`checkout:email:${sanitizedEmail}`, 1, 5000)) {
      return NextResponse.json(
        { error: 'Requisição já em processamento. Aguarde alguns segundos.' },
        { status: 429 }
      )
    }

    const supabase = createServiceClient()
    const asaas = getAsaasClient()

    // Get course (only needed columns for checkout)
    const courseSlug = process.env.COURSE_SLUG_DEFAULT || 'tiktok-shop-do-zero'
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, slug, title, price_cents')
      .eq('slug', courseSlug)
      .single()

    if (courseError || !course) {
      console.error('Course not found:', courseSlug, courseError?.message)
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    // Find or create user in Supabase Auth
    // First check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    let userId: string | null = null

    const existingUser = existingUsers?.users.find(
      (u) => u.email?.toLowerCase() === sanitizedEmail
    )

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create user with a temporary password (they'll need to reset)
      const tempPassword = crypto.randomUUID()
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: sanitizedEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: sanitizedName },
      })

      if (createError) {
        // Handle race condition: if user was created by another request, try to find them
        if (createError.message?.includes('already been registered') ||
            createError.message?.includes('duplicate') ||
            createError.message?.includes('already exists')) {
          const { data: retryUsers } = await supabase.auth.admin.listUsers()
          const retryUser = retryUsers?.users.find(
            (u) => u.email?.toLowerCase() === sanitizedEmail
          )
          if (retryUser) {
            userId = retryUser.id
          } else {
            console.error('Error creating user (race condition recovery failed):', createError.message)
            return NextResponse.json(
              { error: 'Erro ao criar usuário. Tente novamente.' },
              { status: 500 }
            )
          }
        } else {
          console.error('Error creating user:', createError.message)
          return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
          )
        }
      } else {
        userId = newUser.user.id

        // Send password reset email so user can set their password
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: sanitizedEmail,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
          },
        })

        if (linkError) {
          console.error('Error generating password recovery link:', linkError.message)
          // Continue with checkout - user can request password reset later
        } else {
          console.log('Password recovery link generated for new user:', sanitizedEmail)
        }
      }
    }

    // Find or create Asaas customer
    const customer = await asaas.findOrCreateCustomer({
      name: sanitizedName,
      email: sanitizedEmail,
      cpfCnpj: sanitizedCPF,
    })

    // Calculate due date (today)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1) // Due tomorrow
    const dueDateStr = dueDate.toISOString().split('T')[0]

    // Map payment method to Asaas billing type
    const billingTypeMap: Record<string, 'PIX' | 'BOLETO' | 'CREDIT_CARD'> = {
      pix: 'PIX',
      boleto: 'BOLETO',
      card: 'CREDIT_CARD',
    }
    const billingType = billingTypeMap[paymentMethod] || 'PIX'

    // Apply PIX discount (10% off)
    const baseValue = course.price_cents / 100
    const value = billingType === 'PIX' ? baseValue * 0.9 : baseValue

    // Create payment
    const payment = await asaas.createPayment({
      customer: customer.id,
      billingType,
      value,
      dueDate: dueDateStr,
      description: course.title,
      externalReference: JSON.stringify({
        userId,
        courseId: course.id,
        courseSlug: course.slug,
      }),
    })

    // Save payment to database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        course_id: course.id,
        asaas_payment_id: payment.id,
        asaas_customer_id: customer.id,
        status: 'pending',
        value_cents: Math.round(value * 100),
        billing_type: billingType,
      })

    if (paymentError) {
      console.error('Error saving payment:', paymentError.message)
      // Continue anyway - payment was created in Asaas
    }

    safeLog('Checkout created', {
      paymentId: payment.id,
      userId,
      courseSlug: course.slug,
      value: Math.round(value * 100),
      billingType,
    })

    // Get PIX QR code if payment type is PIX
    let pixData = null
    if (billingType === 'PIX') {
      try {
        pixData = await asaas.getPixQrCode(payment.id)
      } catch {
        // PIX QR code might not be immediately available
        console.log('PIX QR code not yet available')
      }
    }

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl: payment.invoiceUrl,
      bankSlipUrl: payment.bankSlipUrl,
      pixQrCode: pixData?.encodedImage,
      pixCopiaECola: pixData?.payload,
      status: payment.status,
      billingType,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento. Tente novamente.' },
      { status: 500 }
    )
  }
}
