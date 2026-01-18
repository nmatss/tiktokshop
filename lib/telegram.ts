/**
 * Telegram Integration Service
 *
 * This service handles sending Telegram community invites to students
 * after their payment is confirmed.
 *
 * Configuration:
 * - TELEGRAM_BOT_TOKEN: Your bot token from @BotFather
 * - TELEGRAM_COMMUNITY_INVITE_LINK: The invite link for your community
 *
 * The bot can optionally send a welcome message to users via their email
 * by integrating with an email service.
 */

export interface TelegramConfig {
  botToken: string | undefined
  communityInviteLink: string | undefined
}

export function getTelegramConfig(): TelegramConfig {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    communityInviteLink: process.env.TELEGRAM_COMMUNITY_INVITE_LINK,
  }
}

export function isTelegramConfigured(): boolean {
  const config = getTelegramConfig()
  return Boolean(config.communityInviteLink)
}

/**
 * Gets the Telegram community invite link.
 * This link is shown to users after payment confirmation.
 */
export function getTelegramInviteLink(): string | null {
  const config = getTelegramConfig()
  return config.communityInviteLink || null
}

/**
 * Sends a message via Telegram Bot API.
 * Useful for sending notifications to a channel or group.
 *
 * @param chatId - The chat ID to send the message to
 * @param message - The message text (supports HTML formatting)
 */
export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  const config = getTelegramConfig()

  if (!config.botToken) {
    console.warn('[Telegram] Bot token not configured')
    return false
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[Telegram] Failed to send message:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Telegram] Error sending message:', error)
    return false
  }
}

/**
 * Notifies a Telegram channel about a new student enrollment.
 * This is optional and can be used to track new sales.
 *
 * @param studentName - The name of the student
 * @param courseName - The name of the course
 */
export async function notifyNewEnrollment(
  studentName: string,
  courseName: string
): Promise<void> {
  const notificationChatId = process.env.TELEGRAM_NOTIFICATION_CHAT_ID

  if (!notificationChatId) {
    return // Notifications not configured, skip silently
  }

  const message = `🎉 <b>Nova matrícula!</b>\n\nAluno: ${studentName}\nCurso: ${courseName}`

  await sendTelegramMessage(notificationChatId, message)
}
