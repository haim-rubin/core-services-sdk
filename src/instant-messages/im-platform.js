/**

Supported instant-messaging application identifiers.

Used across the system to determine which message-mapper,

parser, and processing logic to apply (Telegram vs WhatsApp).

@enum {string}

@property {"telegram"} TELEGRAM - Telegram Bot API messages

@property {"whatsapp"} WHATSAPP - WhatsApp Business API messages
*/
export const IM_PLATFORM = {
  TELEGRAM: 'telegram',
  WHATSAPP: 'whatsapp',
}
