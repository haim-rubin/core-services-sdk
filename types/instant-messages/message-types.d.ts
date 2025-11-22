/**
 * *
 */
export type MESSAGE_MEDIA_TYPE = string
export namespace MESSAGE_MEDIA_TYPE {
  let TEXT: string
  let POLL: string
  let VIDEO: string
  let PHOTO: string
  let IMAGE: string
  let VOICE: string
  let AUDIO: string
  let STICKER: string
  let CONTACT: string
  let MESSAGE: string
  let REACTION: string
  let DOCUMENT: string
  let LOCATION: string
  let CONTACTS: string
  let VIDEO_NOTE: string
  let BUTTON_CLICK: string
  let BUTTON_CLICK_MULTIPLE: string
}
/**
 * *
 */
export type MESSAGE_TYPE = string
export namespace MESSAGE_TYPE {
  let MESSAGE_1: string
  export { MESSAGE_1 as MESSAGE }
  import BUTTON_CLICK_1 = MESSAGE_MEDIA_TYPE.BUTTON_CLICK
  export { BUTTON_CLICK_1 as BUTTON_CLICK }
  import BUTTON_CLICK_MULTIPLE_1 = MESSAGE_MEDIA_TYPE.BUTTON_CLICK_MULTIPLE
  export { BUTTON_CLICK_MULTIPLE_1 as BUTTON_CLICK_MULTIPLE }
  export let UNKNOWN_MESSAGE_TYPE: string
}
/**
 * *
 */
export type MESSAGE_MEDIA_TYPE_MAPPER = string
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
export const MESSAGE_MEDIA_TYPE_MAPPER: {
  [MESSAGE_MEDIA_TYPE.VOICE]: string
  [MESSAGE_MEDIA_TYPE.PHOTO]: string
  [MESSAGE_MEDIA_TYPE.CONTACTS]: string
}
