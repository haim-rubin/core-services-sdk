// @ts-nocheck
import { describe, it, expect } from 'vitest'

import { ResponseType } from '../../src/http/responseType.js'

describe('ResponseType', () => {
  it('should contain correct response type mappings', () => {
    expect(ResponseType).toEqual({
      xml: 'xml',
      json: 'json',
      text: 'text',
      file: 'file',
    })
  })

  it('should be frozen (immutable)', () => {
    expect(Object.isFrozen(ResponseType)).toBe(true)

    // Try to add new property
    expect(() => {
      ResponseType.newType = 'something'
    }).toThrow(TypeError)

    // Try to overwrite existing property
    expect(() => {
      ResponseType.json = 'override'
    }).toThrow(TypeError)

    // Ensure original value remains unchanged
    expect(ResponseType.json).toBe('json')
  })

  it('should include expected keys', () => {
    const keys = Object.keys(ResponseType)
    expect(keys).toEqual(['xml', 'json', 'text', 'file'])
  })

  it('should include expected values', () => {
    const values = Object.values(ResponseType)
    expect(values).toContain('json')
    expect(values).toContain('xml')
    expect(values).toContain('text')
    expect(values).toContain('file')
  })
})
