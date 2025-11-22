import { MESSAGE_MEDIA_TYPE, MESSAGE_TYPE } from './message-types.js'

/**
 * Creates a predicate that checks whether a given media type exists
 * inside the platform-original message object.
 *
 * @param {string} mediaType - One of MESSAGE_MEDIA_TYPE.*
 * @returns {(params: { originalMessage: any }) => boolean}
 */
export const isItMediaType =
  (mediaType) =>
  ({ originalMessage }) => {
    const message = originalMessage?.message
    if (!message || typeof message !== 'object') {
      return false
    }
    return mediaType in message
  }

/**
 * Creates a predicate that checks whether the normalized `type`
 * of the incoming platform message equals a given expected type.
 *
 * @function isMessageTypeof
 * @param {string} typeOfMessage - One of the MESSAGE_TYPE.* values.
 * @returns {(params: { originalMessage: any }) => boolean}
 * A function that accepts an object containing `originalMessage`
 * and returns true if its `type` matches the expected type.
 */
export const isMessageTypeof =
  (typeOfMessage) =>
  ({ originalMessage }) => {
    const type = originalMessage?.type
    return type === typeOfMessage
  }

/**
 * Detects Telegram interactive "callback_query" messages.
 *
 * These represent button clicks on inline keyboards.
 *
 * @function isCallbackQuery
 * @param {Object} params
 * @param {Object} params.originalMessage - Raw Telegram update
 * @returns {boolean}
 */
export const isCallbackQuery = ({ originalMessage }) => {
  return 'callback_query' in originalMessage
}

// Media-type detectors for each supported message detail section.
// Telegram/WhatsApp provide different fields; these predicate utilities
// allow consistent detection used inside getTelegramMessageType().

export const isItPoll = isItMediaType(MESSAGE_MEDIA_TYPE.POLL)
export const isItMessage = isMessageTypeof(MESSAGE_TYPE.MESSAGE)
export const isItVoice = isItMediaType(MESSAGE_MEDIA_TYPE.VOICE)
export const isItVideo = isItMediaType(MESSAGE_MEDIA_TYPE.VIDEO)
export const isItPhoto = isItMediaType(MESSAGE_MEDIA_TYPE.PHOTO)
export const isItFreeText = isItMediaType(MESSAGE_MEDIA_TYPE.TEXT)
export const isItSticker = isItMediaType(MESSAGE_MEDIA_TYPE.STICKER)
export const isItContact = isItMediaType(MESSAGE_MEDIA_TYPE.CONTACT)
export const isItLocation = isItMediaType(MESSAGE_MEDIA_TYPE.LOCATION)
export const isItDocument = isItMediaType(MESSAGE_MEDIA_TYPE.DOCUMENT)
export const isItVideoNote = isItMediaType(MESSAGE_MEDIA_TYPE.VIDEO_NOTE)
export const isItButtonClick = isMessageTypeof(MESSAGE_TYPE.BUTTON_CLICK)

/**
 * Determines a normalized unified message type based on the raw platform update
 * structure received from Telegram or WhatsApp.
 *
 * The resolution order:
 * 1. Callback button click (Telegram inline keyboard)
 * 2. Standard media checks (text, photo, video, etc.)
 * 3. Special formats (polls, video notes, contacts, forwarded messages)
 * 4. Fallback to UNKNOWN_MESSAGE_TYPE
 *
 * @function getTelegramMessageType
 * @param {Object} params
 * @param {Object} params.originalMessage - Raw update object from Telegram or WhatsApp.
 *   For Telegram:
 *     - May contain: message, callback_query, poll, etc.
 *   For WhatsApp:
 *     - Normalized structure after base extraction: { type, message, ... }
 * @returns {string}
 *   Returns one of:
 *   - MESSAGE_MEDIA_TYPE.* (text, photo, video, document, ...)
 *   - MESSAGE_TYPE.BUTTON_CLICK
 *   - MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE
 *
 * @example
 * getTelegramMessageType({ originalMessage: telegramUpdate })
 * // → "text"
 *
 * @example
 * getTelegramMessageType({ originalMessage: whatsappPayload })
 * // → "image"
 */
export const getTelegramMessageType = ({ originalMessage }) => {
  switch (true) {
    case isCallbackQuery({ originalMessage }): {
      return MESSAGE_TYPE.BUTTON_CLICK
    }

    case isItFreeText({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.TEXT
    }

    case isItVideo({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.VIDEO
    }

    case isItPhoto({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.PHOTO
    }

    case isItDocument({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.DOCUMENT
    }

    case isItLocation({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.LOCATION
    }

    case isItVoice({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.VOICE
    }

    case isItVideoNote({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.VIDEO_NOTE
    }

    case isItPoll({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.POLL
    }

    case isItSticker({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.STICKER
    }

    case isItMessage({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.MESSAGE
    }

    case isItContact({ originalMessage }): {
      return MESSAGE_MEDIA_TYPE.CONTACT
    }

    default: {
      return MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE
    }
  }
}
