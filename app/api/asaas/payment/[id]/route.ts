import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID do pagamento não fornecido' },
        { status: 400 }
      )
    }

    const asaasApiKey = process.env.ASAAS_API_KEY
    const asaasApiUrl = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3'

    if (!asaasApiKey) {
      console.error('ASAAS_API_KEY not configured')
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      )
    }

    // Fetch payment from Asaas
    const response = await fetch(`${asaasApiUrl}/payments/${id}`, {
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Asaas API error:', response.status)
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    const payment = await response.json()

    // If it's a PIX payment, get the QR code
    if (payment.billingType === 'PIX') {
      const pixResponse = await fetch(`${asaasApiUrl}/payments/${id}/pixQrCode`, {
        headers: {
          'access_token': asaasApiKey,
          'Content-Type': 'application/json',
        },
      })

      if (pixResponse.ok) {
        const pixData = await pixResponse.json()

        return NextResponse.json({
          id: payment.id,
          value: payment.value,
          status: payment.status,
          pixQrCode: pixData.encodedImage,
          pixCopyPaste: pixData.payload,
          expiresAt: pixData.expirationDate,
        })
      }
    }

    // For non-PIX payments or if PIX QR fetch fails
    return NextResponse.json({
      id: payment.id,
      value: payment.value,
      status: payment.status,
      paymentUrl: payment.invoiceUrl,
    })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do pagamento' },
      { status: 500 }
    )
  }
}
