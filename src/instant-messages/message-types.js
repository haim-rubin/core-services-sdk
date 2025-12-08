/**
 * Enumerates all supported incoming media/content types
 * across messaging platforms (Telegram, WhatsApp, etc).
 *
 * This is the unified taxonomy used inside the system
 * after normalization of the raw message payload.
 *
 * @readonly
 * @enum {string}
 * @type {{ [key: string]: string }}
 *
 * @property {"text"} TEXT
 * @property {"poll"} POLL
 * @property {"video"} VIDEO
 * @property {"photo"} PHOTO
 * @property {"image"} IMAGE
 * @property {"voice"} VOICE
 * @property {"audio"} AUDIO
 * @property {"sticker"} STICKER
 * @property {"contact"} CONTACT
 * @property {"reaction"} REACTION
 * @property {"document"} DOCUMENT
 * @property {"location"} LOCATION
 * @property {"contacts"} CONTACTS
 * @property {"video_note"} VIDEO_NOTE
 * @property {"button_click"} BUTTON_CLICK
 * @property {"button_click_multiple"} BUTTON_CLICK_MULTIPLE
 */
export const MESSAGE_MEDIA_TYPE = {
  TEXT: 'text',
  POLL: 'poll',
  VIDEO: 'video',
  PHOTO: 'photo',
  IMAGE: 'image',
  VOICE: 'voice',
  AUDIO: 'audio',
  STICKER: 'sticker',
  CONTACT: 'contact',
  MESSAGE: 'message',
  REACTION: 'reaction',
  DOCUMENT: 'document',
  LOCATION: 'location',
  CONTACTS: 'contacts',
  VIDEO_NOTE: 'video_note',
  BUTTON_CLICK: 'button_click',
  BUTTON_CLICK_MULTIPLE: 'button_click_multiple',
}
/**
 * Additional high-level message categories.
 *
 * These represent logical groupings rather than raw media types.
 *
 * @readonly
 * @enum {string}
 * @type {{ [key: string]: string }}
 *
 * @property {"message"} MESSAGE
 *   Regular message container (base type in some providers).
 *
 * @property {"button_click"} BUTTON_CLICK
 *   A click on a single interactive button.
 *
 * @property {"button_click_multiple"} BUTTON_CLICK_MULTIPLE
 *   A selection from a list of interactive reply choices.
 *
 * @property {"unknown_message_type"} UNKNOWN_MESSAGE_TYPE
 *   Used when the system cannot identify or normalize the message type.
 */
export const MESSAGE_TYPE = {
  MESSAGE: 'message',
  BUTTON_CLICK: MESSAGE_MEDIA_TYPE.BUTTON_CLICK,
  BUTTON_CLICK_MULTIPLE: MESSAGE_MEDIA_TYPE.BUTTON_CLICK_MULTIPLE,
  UNKNOWN_MESSAGE_TYPE: 'unknown_message_type',
}

/**
 * Maps platform-specific message types into the unified equivalents.
 *
 * This is used to convert raw provider terminology into internal naming.
 *
 * @readonly
 * @enum {string}
 *
 * @property {"audio"} VOICE
 *   Telegram's "voice" is normalized into the system's AUDIO type.
 *
 * @property {"image"} PHOTO
 *   Telegram's "photo" array is normalized into IMAGE.
 *
 * @property {"contact"} CONTACTS
 *   WhatsApp's "contacts" array is normalized into CONTACT.
 */
export const MESSAGE_MEDIA_TYPE_MAPPER = {
  [MESSAGE_MEDIA_TYPE.VOICE]: MESSAGE_MEDIA_TYPE.AUDIO,
  [MESSAGE_MEDIA_TYPE.PHOTO]: MESSAGE_MEDIA_TYPE.IMAGE,
  [MESSAGE_MEDIA_TYPE.CONTACTS]: MESSAGE_MEDIA_TYPE.CONTACT,
}

/**
 * Unified message media types based on existing MESSAGE_MEDIA_TYPE and MESSAGE_TYPE.
 *
 * This enum flattens and merges all raw message media types
 * into a single canonical type list.
 *
 * VOICE → AUDIO
 * PHOTO → IMAGE
 * CONTACTS → CONTACT
 *
 * @readonly
 * @enum {string}
 * @type {{ [key: string]: string }}
 */
export const UNIFIED_MESSAGE_MEDIA_TYPE = {
  ...MESSAGE_MEDIA_TYPE,
  ...MESSAGE_TYPE,

  // Normalized equivalents
  AUDIO: MESSAGE_MEDIA_TYPE.AUDIO,
  IMAGE: MESSAGE_MEDIA_TYPE.IMAGE,
  CONTACT: MESSAGE_MEDIA_TYPE.CONTACT,
}
