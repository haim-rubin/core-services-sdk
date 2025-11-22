/**
 * Enumerates all supported incoming media/content types
 * across messaging platforms (Telegram, WhatsApp, etc).
 *
 * This is the unified taxonomy used inside the system
 * after normalization of the raw message payload.
 *
 * @readonly
 * @enum {string}
 *
 * @property {"text"} TEXT
 *   Represents plain text content.
 *
 * @property {"poll"} POLL
 *   Represents a Telegram poll (multiple-choice question).
 *
 * @property {"video"} VIDEO
 *   Represents a standard video file.
 *
 * @property {"photo"} PHOTO
 *   Represents a Telegram “photo” array (before mapping to IMAGE).
 *
 * @property {"image"} IMAGE
 *   Represents an image file (after normalization).
 *
 * @property {"voice"} VOICE
 *   Represents Telegram's "voice" messages (OGG encoded voice notes).
 *
 * @property {"audio"} AUDIO
 *   Represents general audio files (WhatsApp voice notes, audio uploads).
 *
 * @property {"sticker"} STICKER
 *   Represents sticker messages (Telegram or WhatsApp).
 *
 * @property {"contact"} CONTACT
 *   Represents a shared contact card.
 *
 * @property {"reaction"} REACTION
 *   Represents WhatsApp/Telegram reactions (emojis on messages).
 *
 * @property {"document"} DOCUMENT
 *   Represents generic uploaded files, including PDFs.
 *
 * @property {"location"} LOCATION
 *   Represents geographic coordinates.
 *
 * @property {"contacts"} CONTACTS
 *   Represents WhatsApp contacts array (before mapping to CONTACT).
 *
 * @property {"video_note"} VIDEO_NOTE
 *   Represents Telegram's circular "video note".
 *
 * @property {"button_click"} BUTTON_CLICK
 *   Represents a button press (interactive replies).
 *
 * @property {"button_click_multiple"} BUTTON_CLICK_MULTIPLE
 *   Represents list/menu selection (e.g., WhatsApp list_reply).
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
