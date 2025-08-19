// tests/unit/utils/normalize-min-max.unit.test.js
import { describe, it, expect } from 'vitest'
import { normalizeMinMax } from '../../src/core/normalize-min-max.js'

describe('normalizeMinMax', () => {
  const defaults = { min: 8, max: 64 }

  it('returns defaults if valuesMinMax is null', () => {
    expect(normalizeMinMax(defaults, null)).toEqual(defaults)
  })

  it('returns defaults if valuesMinMax is undefined', () => {
    expect(normalizeMinMax(defaults, undefined)).toEqual(defaults)
  })

  it('returns defaults if valuesMinMax is not an object', () => {
    // @ts-ignore
    expect(normalizeMinMax(defaults, 'invalid')).toEqual(defaults)
  })

  it('uses provided values when within range', () => {
    expect(normalizeMinMax(defaults, { min: 10, max: 32 })).toEqual({
      min: 10,
      max: 32,
    })
  })

  it('clamps values below minimum to default.min', () => {
    expect(normalizeMinMax(defaults, { min: 4, max: 20 })).toEqual({
      min: 8,
      max: 20,
    })
  })

  it('clamps values above maximum to default.max', () => {
    expect(normalizeMinMax(defaults, { min: 20, max: 100 })).toEqual({
      min: 20,
      max: 64,
    })
  })

  it('ensures max is not lower than min', () => {
    expect(normalizeMinMax(defaults, { min: 60, max: 20 })).toEqual({
      min: 60,
      max: 60,
    })
  })

  it('falls back to defaults if min is not a number', () => {
    // @ts-ignore
    expect(normalizeMinMax(defaults, { min: 'abc', max: 32 })).toEqual({
      min: 8,
      max: 32,
    })
  })

  it('falls back to defaults if max is not a number', () => {
    // @ts-ignore
    expect(normalizeMinMax(defaults, { min: 10, max: 'zzz' })).toEqual({
      min: 10,
      max: 64,
    })
  })

  it('handles partial input (only min provided)', () => {
    expect(normalizeMinMax(defaults, { min: 12 })).toEqual({
      min: 12,
      max: 64,
    })
  })

  it('handles partial input (only max provided)', () => {
    expect(normalizeMinMax(defaults, { max: 30 })).toEqual({
      min: 8,
      max: 30,
    })
  })

  it('returns defaults if both values are invalid', () => {
    // @ts-ignore
    expect(normalizeMinMax(defaults, { min: 'a', max: null })).toEqual(defaults)
  })
})
