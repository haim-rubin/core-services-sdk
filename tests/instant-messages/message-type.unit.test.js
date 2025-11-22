import { describe, it, expect } from 'vitest'
import {
  isItPoll,
  isItPhoto,
  isItVideo,
  isItVoice,
  isItContact,
  isItDocument,
  isItFreeText,
  isItMediaType,
  getTelegramMessageType,
  isMessageTypeof,
  isCallbackQuery,
} from '../../src/instant-messages/message-type.js'

import {
  MESSAGE_MEDIA_TYPE,
  MESSAGE_TYPE,
} from '../../src/instant-messages/message-types.js'

describe('message-type helpers', () => {
  describe('isItMediaType', () => {
    const isPhoto = isItMediaType(MESSAGE_MEDIA_TYPE.PHOTO)

    it('returns true when media type exists inside message', () => {
      const originalMessage = { message: { photo: [{}] } }
      expect(isPhoto({ originalMessage })).toBe(true)
    })

    it('returns false when media type does not exist', () => {
      const originalMessage = { message: { text: 'hi' } }
      expect(isPhoto({ originalMessage })).toBe(false)
    })

    it('returns false when message is missing', () => {
      expect(isPhoto({ originalMessage: {} })).toBe(false)
      expect(isPhoto({ originalMessage: null })).toBe(false)
    })
  })

  describe('isMessageTypeof', () => {
    const isButtonClick = isMessageTypeof(MESSAGE_TYPE.BUTTON_CLICK)

    it('returns true when type matches', () => {
      const originalMessage = { type: MESSAGE_TYPE.BUTTON_CLICK }
      expect(isButtonClick({ originalMessage })).toBe(true)
    })

    it('returns false when type differs', () => {
      const originalMessage = { type: MESSAGE_MEDIA_TYPE.TEXT }
      expect(isButtonClick({ originalMessage })).toBe(false)
    })

    it('returns false on missing type', () => {
      const originalMessage = {}
      expect(isButtonClick({ originalMessage })).toBe(false)
    })
  })

  describe('isCallbackQuery', () => {
    it('returns true for Telegram callback_query', () => {
      const originalMessage = { callback_query: { data: '1' } }
      expect(isCallbackQuery({ originalMessage })).toBe(true)
    })

    it('returns false otherwise', () => {
      expect(isCallbackQuery({ originalMessage: {} })).toBe(false)
    })
  })

  describe('media helpers', () => {
    it('isItFreeText works', () => {
      expect(
        isItFreeText({ originalMessage: { message: { text: 'hi' } } }),
      ).toBe(true)
    })

    it('isItPhoto works', () => {
      expect(isItPhoto({ originalMessage: { message: { photo: [{}] } } })).toBe(
        true,
      )
    })

    it('isItVideo works', () => {
      expect(isItVideo({ originalMessage: { message: { video: {} } } })).toBe(
        true,
      )
    })

    it('isItVoice works', () => {
      expect(isItVoice({ originalMessage: { message: { voice: {} } } })).toBe(
        true,
      )
    })

    it('isItDocument works', () => {
      expect(
        isItDocument({ originalMessage: { message: { document: {} } } }),
      ).toBe(true)
    })

    it('isItContact works', () => {
      expect(
        isItContact({ originalMessage: { message: { contact: {} } } }),
      ).toBe(true)
    })

    it('isItPoll works', () => {
      expect(isItPoll({ originalMessage: { message: { poll: {} } } })).toBe(
        true,
      )
    })
  })

  describe('getTelegramMessageType', () => {
    it('detects callback_query → BUTTON_CLICK', () => {
      const originalMessage = { callback_query: {} }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_TYPE.BUTTON_CLICK,
      )
    })

    it('detects text', () => {
      const originalMessage = { message: { text: 'hello' } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.TEXT,
      )
    })

    it('detects photo', () => {
      const originalMessage = { message: { photo: [{}] } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.PHOTO,
      )
    })

    it('detects video', () => {
      const originalMessage = { message: { video: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.VIDEO,
      )
    })

    it('detects document', () => {
      const originalMessage = { message: { document: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.DOCUMENT,
      )
    })

    it('detects location', () => {
      const originalMessage = { message: { location: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.LOCATION,
      )
    })

    it('detects voice', () => {
      const originalMessage = { message: { voice: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.VOICE,
      )
    })

    it('detects poll', () => {
      const originalMessage = { message: { poll: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.POLL,
      )
    })

    it('detects sticker', () => {
      const originalMessage = { message: { sticker: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.STICKER,
      )
    })

    it('detects contact', () => {
      const originalMessage = { message: { contact: {} } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_MEDIA_TYPE.CONTACT,
      )
    })

    it('falls back to UNKNOWN_MESSAGE_TYPE', () => {
      const originalMessage = { message: { something_else: 'x' } }
      expect(getTelegramMessageType({ originalMessage })).toBe(
        MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE,
      )
    })
  })
})
