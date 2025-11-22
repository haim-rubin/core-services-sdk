import { describe, it, expect } from 'vitest'
import {
  MESSAGE_TYPE,
  MESSAGE_MEDIA_TYPE,
  MESSAGE_MEDIA_TYPE_MAPPER,
} from '../../src/instant-messages/message-types.js'

describe('MESSAGE_MEDIA_TYPE', () => {
  it('should contain all required media type keys', () => {
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('TEXT')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('POLL')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('VIDEO')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('PHOTO')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('IMAGE')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('VOICE')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('AUDIO')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('STICKER')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('CONTACT')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('MESSAGE')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('REACTION')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('DOCUMENT')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('LOCATION')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('CONTACTS')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('VIDEO_NOTE')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('BUTTON_CLICK')
    expect(MESSAGE_MEDIA_TYPE).toHaveProperty('BUTTON_CLICK_MULTIPLE')
  })

  it('should have correct string values', () => {
    expect(MESSAGE_MEDIA_TYPE.TEXT).toBe('text')
    expect(MESSAGE_MEDIA_TYPE.POLL).toBe('poll')
    expect(MESSAGE_MEDIA_TYPE.VIDEO).toBe('video')
    expect(MESSAGE_MEDIA_TYPE.PHOTO).toBe('photo')
    expect(MESSAGE_MEDIA_TYPE.IMAGE).toBe('image')
    expect(MESSAGE_MEDIA_TYPE.VOICE).toBe('voice')
    expect(MESSAGE_MEDIA_TYPE.AUDIO).toBe('audio')
    expect(MESSAGE_MEDIA_TYPE.STICKER).toBe('sticker')
    expect(MESSAGE_MEDIA_TYPE.CONTACT).toBe('contact')
    expect(MESSAGE_MEDIA_TYPE.MESSAGE).toBe('message')
    expect(MESSAGE_MEDIA_TYPE.REACTION).toBe('reaction')
    expect(MESSAGE_MEDIA_TYPE.DOCUMENT).toBe('document')
    expect(MESSAGE_MEDIA_TYPE.LOCATION).toBe('location')
    expect(MESSAGE_MEDIA_TYPE.CONTACTS).toBe('contacts')
    expect(MESSAGE_MEDIA_TYPE.VIDEO_NOTE).toBe('video_note')
    expect(MESSAGE_MEDIA_TYPE.BUTTON_CLICK).toBe('button_click')
    expect(MESSAGE_MEDIA_TYPE.BUTTON_CLICK_MULTIPLE).toBe(
      'button_click_multiple',
    )
  })
})

describe('MESSAGE_TYPE', () => {
  it('should contain all expected keys', () => {
    expect(MESSAGE_TYPE).toHaveProperty('MESSAGE')
    expect(MESSAGE_TYPE).toHaveProperty('BUTTON_CLICK')
    expect(MESSAGE_TYPE).toHaveProperty('BUTTON_CLICK_MULTIPLE')
    expect(MESSAGE_TYPE).toHaveProperty('UNKNOWN_MESSAGE_TYPE')
  })

  it('should correctly reuse MEDIA_TYPE for interactive types', () => {
    expect(MESSAGE_TYPE.BUTTON_CLICK).toBe('button_click')
    expect(MESSAGE_TYPE.BUTTON_CLICK_MULTIPLE).toBe('button_click_multiple')
  })

  it('should correctly define fallback unknown type', () => {
    expect(MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE).toBe('unknown_message_type')
  })
})

describe('MESSAGE_MEDIA_TYPE_MAPPER', () => {
  it('should correctly map Telegram voice → audio', () => {
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.VOICE]).toBe(
      MESSAGE_MEDIA_TYPE.AUDIO,
    )
  })

  it('should correctly map Telegram photo → image', () => {
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.PHOTO]).toBe(
      MESSAGE_MEDIA_TYPE.IMAGE,
    )
  })

  it('should correctly map WhatsApp contacts → contact', () => {
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.CONTACTS]).toBe(
      MESSAGE_MEDIA_TYPE.CONTACT,
    )
  })

  it('should not map unrelated keys', () => {
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.VIDEO]).toBeUndefined()
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.TEXT]).toBeUndefined()
  })
})
