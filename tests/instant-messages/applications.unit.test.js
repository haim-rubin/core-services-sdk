import { describe, it, expect } from 'vitest'
import { IM_PLATFORM } from '../../src/instant-messages/im-platform.js'

describe('IM_PLATFORM enum', () => {
  it('should expose the expected keys', () => {
    expect(IM_PLATFORM).toHaveProperty('TELEGRAM')
    expect(IM_PLATFORM).toHaveProperty('WHATSAPP')
  })

  it('should map keys to correct string values', () => {
    expect(IM_PLATFORM.TELEGRAM).toBe('telegram')
    expect(IM_PLATFORM.WHATSAPP).toBe('whatsapp')
  })

  it('should contain exactly two entries and nothing else', () => {
    expect(Object.keys(IM_PLATFORM).length).toBe(2)
    expect(Object.values(IM_PLATFORM)).toContain('telegram')
    expect(Object.values(IM_PLATFORM)).toContain('whatsapp')
  })

  it('should not allow undefined application identifiers', () => {
    const allowed = Object.values(IM_PLATFORM)
    expect(allowed.includes('signal')).toBe(false)
    expect(allowed.includes('viber')).toBe(false)
    expect(allowed.includes('sms')).toBe(false)
  })
})
