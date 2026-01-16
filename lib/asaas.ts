import { safeLog } from './security'

const ASAAS_API_BASE = process.env.ASAAS_API_BASE_URL || 'https://sandbox.asaas.com/api/v3'
const ASAAS_API_KEY = process.env.ASAAS_API_KEY

interface AsaasCustomer {
  id: string
  name: string
  email: string
  cpfCnpj?: string
}

interface AsaasPayment {
  id: string
  customer: string
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
  value: number
  dueDate: string
  description?: string
  externalReference?: string
  invoiceUrl?: string
  bankSlipUrl?: string
  pixQrCodeUrl?: string
  pixCopiaECola?: string
  status: string
}

interface CreateCustomerParams {
  name: string
  email: string
  cpfCnpj?: string
}

interface CreatePaymentParams {
  customer: string
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
  value: number
  dueDate: string
  description?: string
  externalReference?: string
}

class AsaasClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY is not configured')
    }
    this.apiKey = ASAAS_API_KEY
    this.baseUrl = ASAAS_API_BASE
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.apiKey,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      safeLog('Asaas API Error', {
        endpoint,
        status: response.status,
        error: data,
      })
      throw new Error(data.errors?.[0]?.description || 'Asaas API error')
    }

    return data as T
  }

  // Find or create customer by email
  async findOrCreateCustomer(params: CreateCustomerParams): Promise<AsaasCustomer> {
    // Try to find existing customer
    const searchResponse = await this.request<{ data: AsaasCustomer[] }>(
      `/customers?email=${encodeURIComponent(params.email)}`
    )

    if (searchResponse.data && searchResponse.data.length > 0) {
      return searchResponse.data[0]
    }

    // Create new customer
    const customer = await this.request<AsaasCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        cpfCnpj: params.cpfCnpj,
        notificationDisabled: false,
      }),
    })

    safeLog('Customer created', { id: customer.id, email: params.email })
    return customer
  }

  // Create payment (PIX by default)
  async createPayment(params: CreatePaymentParams): Promise<AsaasPayment> {
    const payment = await this.request<AsaasPayment>('/payments', {
      method: 'POST',
      body: JSON.stringify(params),
    })

    safeLog('Payment created', {
      id: payment.id,
      billingType: params.billingType,
      value: params.value,
      externalReference: params.externalReference,
    })

    return payment
  }

  // Get payment by ID
  async getPayment(paymentId: string): Promise<AsaasPayment> {
    return this.request<AsaasPayment>(`/payments/${paymentId}`)
  }

  // Get PIX QR Code for payment
  async getPixQrCode(paymentId: string): Promise<{
    encodedImage: string
    payload: string
    expirationDate: string
  }> {
    return this.request(`/payments/${paymentId}/pixQrCode`)
  }
}

// Singleton instance
let asaasClient: AsaasClient | null = null

export function getAsaasClient(): AsaasClient {
  if (!asaasClient) {
    asaasClient = new AsaasClient()
  }
  return asaasClient
}

// Webhook event types we care about
export const PAYMENT_CONFIRMED_EVENTS = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED']
export const PAYMENT_CREATED_EVENT = 'PAYMENT_CREATED'
export const PAYMENT_OVERDUE_EVENT = 'PAYMENT_OVERDUE'
export const PAYMENT_REFUNDED_EVENT = 'PAYMENT_REFUNDED'

export interface AsaasWebhookPayload {
  event: string
  payment: {
    id: string
    customer: string
    billingType: string
    value: number
    status: string
    externalReference?: string
    confirmedDate?: string
  }
}

// Map Asaas status to our internal status
export function mapAsaasStatus(asaasStatus: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'pending',
    RECEIVED: 'confirmed',
    CONFIRMED: 'confirmed',
    OVERDUE: 'overdue',
    REFUNDED: 'refunded',
    RECEIVED_IN_CASH: 'confirmed',
    REFUND_REQUESTED: 'refund_requested',
    CHARGEBACK_REQUESTED: 'chargeback',
    CHARGEBACK_DISPUTE: 'chargeback',
    AWAITING_CHARGEBACK_REVERSAL: 'chargeback',
    DUNNING_REQUESTED: 'dunning',
    DUNNING_RECEIVED: 'dunning',
    AWAITING_RISK_ANALYSIS: 'pending',
  }

  return statusMap[asaasStatus] || 'unknown'
}
