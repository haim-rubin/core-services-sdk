import { describe, it, expect } from 'vitest'
import * as raw from 'google-libphonenumber'

import {
  phoneUtil,
  normalizePhoneOrThrow,
  normalizePhoneOrThrowIntl,
  normalizePhoneOrThrowWithRegion,
} from '../../src/core/normalize-phone-number.js'

const { PhoneNumberFormat } = raw

/**
 * Get a valid example number for a given region from libphonenumber.
 * This keeps tests stable across environments and avoids fake numbers.
 * @param {string} region - e.g. "IL", "US"
 */
function exampleForRegion(region) {
  const ex = phoneUtil().getExampleNumber(region)
  return {
    e164: phoneUtil().format(ex, PhoneNumberFormat.E164),
    national: phoneUtil().format(ex, PhoneNumberFormat.NATIONAL),
    region,
  }
}
describe('phone normalization', () => {
  describe('phone normalization helpers', () => {
    it('normalizePhoneOrThrowIntl: parses a valid international number (US)', () => {
      const us = exampleForRegion('US')
      const out = normalizePhoneOrThrowIntl(us.e164)
      expect(out.e164).toBe(us.e164)
      expect(out.regionCode).toBe('US')
      expect(out.international).toMatch(/^\+1\b/)
    })

    it('normalizePhoneOrThrowWithRegion: parses a national number with region (IL)', () => {
      const il = exampleForRegion('IL')
      // introduce some separators/spaces to mimic user input
      const dirty = `  ${il.national.replace(/\s/g, '-')}  `
      const out = normalizePhoneOrThrowWithRegion(dirty, 'IL')
      expect(out.e164).toBe(il.e164)
      expect(out.regionCode).toBe('IL')
      expect(out.international).toMatch(/^\+972/)
    })

    it('normalizePhoneOrThrow (smart): international path without region', () => {
      const us = exampleForRegion('US')
      const out = normalizePhoneOrThrow(us.e164)
      expect(out.e164).toBe(us.e164)
      expect(out.regionCode).toBe('US')
    })

    it('normalizePhoneOrThrow (smart): national path requires defaultRegion', () => {
      const il = exampleForRegion('IL')
      const dirty = il.national.replace(/\s/g, ' - ')
      const out = normalizePhoneOrThrow(dirty, { defaultRegion: 'IL' })
      expect(out.e164).toBe(il.e164)
      expect(out.regionCode).toBe('IL')
    })

    it('normalizePhoneOrThrow (smart): throws if national with no defaultRegion', () => {
      expect(() => normalizePhoneOrThrow('054-123-4567')).toThrow(
        /defaultRegion is required/i,
      )
    })

    it('all helpers: throw on truly invalid numbers', () => {
      expect(() => normalizePhoneOrThrowIntl('++972')).toThrow(
        /Invalid phone number/i,
      )
      expect(() => normalizePhoneOrThrowWithRegion('123', 'IL')).toThrow(
        /Invalid phone number/i,
      )
      expect(() => normalizePhoneOrThrow('++972')).toThrow(
        /Invalid phone number/i,
      )
    })

    it('should normalize a valid international number', () => {
      const result = normalizePhoneOrThrowIntl('+972523444444')

      expect(result).toMatchObject({
        e164: '+972523444444',
        national: expect.stringContaining('052'),
        international: expect.stringContaining('+972'),
        regionCode: 'IL',
        type: expect.any(Number), // e.g. 1 = MOBILE
      })
    })
  })

  describe('phone normalization — no region (international) & with region', () => {
    // Valid full international IL mobile number (E.164)
    const intlIl = '+972523444444' // 052-344-4444

    it('normalizePhoneOrThrowIntl: accepts full international number without region', () => {
      const out = normalizePhoneOrThrowIntl(intlIl)
      expect(out.e164).toBe(intlIl)
      expect(out.regionCode).toBe('IL')
      expect(out.international).toMatch(/^\+972/)
      expect(typeof out.type).toBe('number')
    })

    it('normalizePhoneOrThrow (smart): accepts +972... without defaultRegion', () => {
      const out = normalizePhoneOrThrow(intlIl) // no opts.defaultRegion
      expect(out.e164).toBe(intlIl)
      expect(out.regionCode).toBe('IL')
    })

    it('normalizePhoneOrThrowWithRegion: accepts national number with region', () => {
      const out = normalizePhoneOrThrowWithRegion('052-344-4444', 'IL')
      expect(out.e164).toBe(intlIl)
      expect(out.regionCode).toBe('IL')
      expect(out.national).toMatch(/052/)
    })
  })
})
