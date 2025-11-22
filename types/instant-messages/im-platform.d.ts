/**
 *
 * Supported instant-messaging application identifiers.
 *
 * Used across the system to determine which message-mapper,
 *
 * parser, and processing logic to apply (Telegram vs WhatsApp).
 */
export type IM_PLATFORM = string
export namespace IM_PLATFORM {
  let TELEGRAM: string
  let WHATSAPP: string
}
