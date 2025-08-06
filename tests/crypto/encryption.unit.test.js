// @ts-nocheck
import { describe, it, expect } from 'vitest'

import { encryptPassword } from '../../src/crypto/encryption.js'

describe('encryptPassword', () => {
  const password = 'MyS3cretP@ss'
  const privateKey = 'abc123'
  const saltLength = 16

  it('returns salt and password in expected format', async () => {
    const result = await encryptPassword(
      { password },
      { saltLength, passwordPrivateKey: privateKey },
    )

    expect(typeof result).toBe('object')
    expect(typeof result.salt).toBe('string')
    expect(typeof result.password).toBe('string')

    expect(result.salt.length).toBe(saltLength * 2) // because it's hex
    expect(result.salt).toMatch(/^[0-9a-f]+$/i)
    expect(result.password).toMatch(/^[0-9a-f]+$/i)
  })

  it('produces different output for the same password (due to different salts)', async () => {
    const result1 = await encryptPassword(
      { password },
      { saltLength, passwordPrivateKey: privateKey },
    )

    const result2 = await encryptPassword(
      { password },
      { saltLength, passwordPrivateKey: privateKey },
    )

    expect(result1.password).not.toEqual(result2.password)
    expect(result1.salt).not.toEqual(result2.salt)
  })

  it('produces different output when passwordPrivateKey is changed', async () => {
    const result1 = await encryptPassword(
      { password },
      { saltLength, passwordPrivateKey: 'key1' },
    )

    const result2 = await encryptPassword(
      { password },
      { saltLength, passwordPrivateKey: 'key2' },
    )

    expect(result1.password).not.toEqual(result2.password)
  })

  it('works without passwordPrivateKey', async () => {
    const result = await encryptPassword({ password }, { saltLength })

    expect(result).toHaveProperty('salt')
    expect(result).toHaveProperty('password')
  })

  it('throws if password is missing', async () => {
    await expect(() =>
      encryptPassword({}, { saltLength, passwordPrivateKey: privateKey }),
    ).rejects.toThrow()
  })

  it('throws if saltLength is missing', async () => {
    await expect(() =>
      encryptPassword({ password }, { passwordPrivateKey: privateKey }),
    ).rejects.toThrow()
  })
})
