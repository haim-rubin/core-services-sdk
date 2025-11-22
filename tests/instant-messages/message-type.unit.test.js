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
      const imMessage = { message: { photo: [{}] } }
      expect(isPhoto({ imMessage })).toBe(true)
    })

    it('returns false when media type does not exist', () => {
      const imMessage = { message: { text: 'hi' } }
      expect(isPhoto({ imMessage })).toBe(false)
    })

    it('returns false when message is missing', () => {
      expect(isPhoto({ imMessage: {} })).toBe(false)
      expect(isPhoto({ imMessage: null })).toBe(false)
    })
  })

  describe('isMessageTypeof', () => {
    const isButtonClick = isMessageTypeof(MESSAGE_TYPE.BUTTON_CLICK)

    it('returns true when type matches', () => {
      const imMessage = { type: MESSAGE_TYPE.BUTTON_CLICK }
      expect(isButtonClick({ imMessage })).toBe(true)
    })

    it('returns false when type differs', () => {
      const imMessage = { type: MESSAGE_MEDIA_TYPE.TEXT }
      expect(isButtonClick({ imMessage })).toBe(false)
    })

    it('returns false on missing type', () => {
      const imMessage = {}
      expect(isButtonClick({ imMessage })).toBe(false)
    })
  })

  describe('isCallbackQuery', () => {
    it('returns true for Telegram callback_query', () => {
      const imMessage = { callback_query: { data: '1' } }
      expect(isCallbackQuery({ imMessage })).toBe(true)
    })

    it('returns false otherwise', () => {
      expect(isCallbackQuery({ imMessage: {} })).toBe(false)
    })
  })

  describe('media helpers', () => {
    it('isItFreeText works', () => {
      expect(isItFreeText({ imMessage: { message: { text: 'hi' } } })).toBe(
        true,
      )
    })

    it('isItPhoto works', () => {
      expect(isItPhoto({ imMessage: { message: { photo: [{}] } } })).toBe(true)
    })

    it('isItVideo works', () => {
      expect(isItVideo({ imMessage: { message: { video: {} } } })).toBe(true)
    })

    it('isItVoice works', () => {
      expect(isItVoice({ imMessage: { message: { voice: {} } } })).toBe(true)
    })

    it('isItDocument works', () => {
      expect(isItDocument({ imMessage: { message: { document: {} } } })).toBe(
        true,
      )
    })

    it('isItContact works', () => {
      expect(isItContact({ imMessage: { message: { contact: {} } } })).toBe(
        true,
      )
    })

    it('isItPoll works', () => {
      expect(isItPoll({ imMessage: { message: { poll: {} } } })).toBe(true)
    })
  })

  describe('getTelegramMessageType', () => {
    it('detects callback_query → BUTTON_CLICK', () => {
      const imMessage = { callback_query: {} }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_TYPE.BUTTON_CLICK,
      )
    })

    it('detects text', () => {
      const imMessage = { message: { text: 'hello' } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.TEXT,
      )
    })

    it('detects photo', () => {
      const imMessage = { message: { photo: [{}] } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.PHOTO,
      )
    })

    it('detects video', () => {
      const imMessage = { message: { video: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.VIDEO,
      )
    })

    it('detects document', () => {
      const imMessage = { message: { document: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.DOCUMENT,
      )
    })

    it('detects location', () => {
      const imMessage = { message: { location: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.LOCATION,
      )
    })

    it('detects voice', () => {
      const imMessage = { message: { voice: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.VOICE,
      )
    })

    it('detects poll', () => {
      const imMessage = { message: { poll: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.POLL,
      )
    })

    it('detects sticker', () => {
      const imMessage = { message: { sticker: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.STICKER,
      )
    })

    it('detects contact', () => {
      const imMessage = { message: { contact: {} } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_MEDIA_TYPE.CONTACT,
      )
    })

    it('falls back to UNKNOWN_MESSAGE_TYPE', () => {
      const imMessage = { message: { something_else: 'x' } }
      expect(getTelegramMessageType({ imMessage })).toBe(
        MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE,
      )
    })
  })
})
