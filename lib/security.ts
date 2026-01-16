import { headers } from 'next/headers'

// Validate Asaas webhook token
export async function validateWebhookToken(): Promise<boolean> {
  const headersList = await headers()
  const token = headersList.get('asaas-access-token') || headersList.get('x-webhook-token')
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN

  if (!expectedToken) {
    console.error('[Webhook] ASAAS_WEBHOOK_TOKEN not configured')
    return false
  }

  if (!token) {
    console.error('[Webhook] No token provided in request')
    return false
  }

  // Timing-safe comparison
  if (token.length !== expectedToken.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }

  return result === 0
}

// Safe logging - removes sensitive data
export function safeLog(event: string, data: Record<string, unknown>): void {
  const sanitized = { ...data }

  // Remove sensitive fields
  const sensitiveFields = [
    'cpfCnpj',
    'creditCard',
    'cardNumber',
    'cvv',
    'password',
    'token',
    'accessToken',
    'apiKey',
  ]

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]'
    }
  }

  // Truncate large objects
  const logData = JSON.stringify(sanitized)
  const truncatedData = logData.length > 1000
    ? logData.substring(0, 1000) + '...[truncated]'
    : logData

  console.log(`[${event}]`, truncatedData)
}

// Rate limiting helper (simple in-memory for MVP)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = requestCounts.get(identifier)

  if (!record || now > record.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic XSS prevention
    .substring(0, 1000) // Limit length
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// CPF validation with checksum verification
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')

  // Check length
  if (cleaned.length !== 11) {
    return false
  }

  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1+$/.test(cleaned)) {
    return false
  }

  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleaned.charAt(9))) {
    return false
  }

  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleaned.charAt(10))) {
    return false
  }

  return true
}
