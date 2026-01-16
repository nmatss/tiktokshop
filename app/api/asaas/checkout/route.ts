import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getAsaasClient } from '@/lib/asaas'
import { isValidEmail, isValidCPF, sanitizeInput, safeLog, checkRateLimit } from '@/lib/security'

export async function POST(request: NextRequest) {
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
    const { name, email, cpf } = body

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

    const supabase = createServiceClient()
    const asaas = getAsaasClient()

    // Get course
    const courseSlug = process.env.COURSE_SLUG_DEFAULT || 'tiktok-shop-do-zero'
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', courseSlug)
      .single()

    if (courseError || !course) {
      console.error('Course not found:', courseSlug)
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
        console.error('Error creating user:', createError.message)
        return NextResponse.json(
          { error: 'Erro ao criar usuário' },
          { status: 500 }
        )
      }

      userId = newUser.user.id

      // Send password reset email so user can set their password
      await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: sanitizedEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
        },
      })
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

    // Create payment
    const payment = await asaas.createPayment({
      customer: customer.id,
      billingType: 'PIX',
      value: course.price_cents / 100, // Asaas uses decimal value
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
        value_cents: course.price_cents,
        billing_type: 'PIX',
      })

    if (paymentError) {
      console.error('Error saving payment:', paymentError.message)
      // Continue anyway - payment was created in Asaas
    }

    safeLog('Checkout created', {
      paymentId: payment.id,
      userId,
      courseSlug: course.slug,
      value: course.price_cents,
    })

    // Get PIX QR code
    let pixData = null
    try {
      pixData = await asaas.getPixQrCode(payment.id)
    } catch {
      // PIX QR code might not be immediately available
      console.log('PIX QR code not yet available')
    }

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl: payment.invoiceUrl,
      pixQrCode: pixData?.encodedImage,
      pixCopiaECola: pixData?.payload,
      status: payment.status,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento. Tente novamente.' },
      { status: 500 }
    )
  }
}
