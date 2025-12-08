import { describe, it, expect } from 'vitest'
import {
  MESSAGE_TYPE,
  MESSAGE_MEDIA_TYPE,
  MESSAGE_MEDIA_TYPE_MAPPER,
  UNIFIED_MESSAGE_MEDIA_TYPE,
} from '../../src/instant-messages/message-types.js'

describe('UNIFIED_MESSAGE_MEDIA_TYPE', () => {
  it('should include all keys from MESSAGE_MEDIA_TYPE via spread', () => {
    for (const key of Object.keys(MESSAGE_MEDIA_TYPE)) {
      expect(UNIFIED_MESSAGE_MEDIA_TYPE).toHaveProperty(key)
      expect(UNIFIED_MESSAGE_MEDIA_TYPE[key]).toBe(MESSAGE_MEDIA_TYPE[key])
    }
  })

  it('should include all keys from MESSAGE_TYPE via spread', () => {
    for (const key of Object.keys(MESSAGE_TYPE)) {
      expect(UNIFIED_MESSAGE_MEDIA_TYPE).toHaveProperty(key)
      expect(UNIFIED_MESSAGE_MEDIA_TYPE[key]).toBe(MESSAGE_TYPE[key])
    }
  })

  it('should include normalized AUDIO mapped from VOICE', () => {
    expect(UNIFIED_MESSAGE_MEDIA_TYPE.AUDIO).toBe(MESSAGE_MEDIA_TYPE.AUDIO)
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.VOICE]).toBe(
      MESSAGE_MEDIA_TYPE.AUDIO,
    )
  })

  it('should include normalized IMAGE mapped from PHOTO', () => {
    expect(UNIFIED_MESSAGE_MEDIA_TYPE.IMAGE).toBe(MESSAGE_MEDIA_TYPE.IMAGE)
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.PHOTO]).toBe(
      MESSAGE_MEDIA_TYPE.IMAGE,
    )
  })

  it('should include normalized CONTACT mapped from CONTACTS', () => {
    expect(UNIFIED_MESSAGE_MEDIA_TYPE.CONTACT).toBe(MESSAGE_MEDIA_TYPE.CONTACT)
    expect(MESSAGE_MEDIA_TYPE_MAPPER[MESSAGE_MEDIA_TYPE.CONTACTS]).toBe(
      MESSAGE_MEDIA_TYPE.CONTACT,
    )
  })

  it('should define UNKNOWN correctly', () => {
    expect(UNIFIED_MESSAGE_MEDIA_TYPE.UNKNOWN_MESSAGE_TYPE).toBe(
      MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE,
    )
  })

  it('should not contain unexpected duplicates', () => {
    const values = Object.values(UNIFIED_MESSAGE_MEDIA_TYPE)
    const uniqueValues = new Set(values)
    expect(values.length).toBe(uniqueValues.size)
  })

  it('should contain required high-level unified types', () => {
    const required = [
      'TEXT',
      'IMAGE',
      'AUDIO',
      'VIDEO',
      'DOCUMENT',
      'STICKER',
      'CONTACT',
      'LOCATION',
      'POLL',
      'VIDEO_NOTE',
      'BUTTON_CLICK',
      'BUTTON_CLICK_MULTIPLE',
      'REACTION',
    ]

    for (const key of required) {
      expect(UNIFIED_MESSAGE_MEDIA_TYPE).toHaveProperty(key)
    }
  })
})
