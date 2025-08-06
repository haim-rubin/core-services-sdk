import { describe, it, expect } from 'vitest'

import {
  generateCode,
  generateCodeAlpha,
  generateCodeDigits,
  generateCodeAlphaNumeric,
  generateCodeAlphaNumericSymbols,
  OTP_GENERATOR_TYPES,
} from '../../src/core/otp-generators.js'

const charsetForType = {
  [OTP_GENERATOR_TYPES.numeric]: /^[0-9]+$/,
  [OTP_GENERATOR_TYPES.alpha]: /^[a-zA-Z]+$/,
  [OTP_GENERATOR_TYPES.symbols]: /^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/,
  [OTP_GENERATOR_TYPES.alphaLower]: /^[a-z]+$/,
  [OTP_GENERATOR_TYPES.alphaUpper]: /^[A-Z]+$/,
  [OTP_GENERATOR_TYPES.alphanumeric]: /^[a-zA-Z0-9]+$/,
  [OTP_GENERATOR_TYPES.alphanumericSymbols]:
    /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/,
  [OTP_GENERATOR_TYPES.any]: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/,
}

describe('generateCode', () => {
  it('generates code with correct length', () => {
    const code = generateCode({ length: 10, type: 'numeric' })
    expect(code).toHaveLength(10)
  })

  it('uses fallback to default type when type is not provided', () => {
    const code = generateCode()
    expect(code).toMatch(/^[0-9]+$/)
  })

  it('throws error for invalid length', () => {
    expect(() => generateCode({ length: 0 })).toThrow(/length must be a number/)
    expect(() => generateCode({ length: 100 })).toThrow(
      /length must be a number/,
    )
  })

  it('throws error for invalid charset (non-string)', () => {
    // @ts-ignore
    expect(() => generateCode({ charset: 123 })).toThrow(
      /charset must be a string/,
    )
  })

  it('throws error for empty charset', () => {
    expect(() => generateCode({ charset: '' })).toThrow(
      /charset must not be empty/,
    )
  })

  it('throws error for unknown type', () => {
    expect(() => generateCode({ type: 'unknown_type' })).toThrow(
      /type must be one of:/,
    )
  })

  it('respects custom charset', () => {
    const code = generateCode({ length: 5, charset: 'ABC' })
    expect(code).toMatch(/^[ABC]+$/)
    expect(code.length).toBe(5)
  })

  for (const [type, regex] of Object.entries(charsetForType)) {
    it(`generates ${type} OTP correctly`, () => {
      const code = generateCode({ length: 8, type })
      expect(code).toMatch(regex)
    })
  }
})

describe('Shortcuts', () => {
  it('generateCodeAlpha produces alphabetic code', () => {
    expect(generateCodeAlpha(6)).toMatch(/^[a-zA-Z]{6}$/)
  })

  it('generateCodeDigits produces numeric code', () => {
    expect(generateCodeDigits(6)).toMatch(/^[0-9]{6}$/)
  })

  it('generateCodeAlphaNumeric produces alphanumeric code', () => {
    expect(generateCodeAlphaNumeric(6)).toMatch(/^[a-zA-Z0-9]{6}$/)
  })

  it('generateCodeAlphaNumericSymbols includes symbols', () => {
    expect(generateCodeAlphaNumericSymbols(6)).toMatch(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6}$/,
    )
  })
})
