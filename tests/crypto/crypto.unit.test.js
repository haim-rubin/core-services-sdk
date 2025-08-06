import { describe, it, expect } from 'vitest'

import {
  getSalt,
  encrypt,
  getSaltHex,
  isPasswordMatch,
  getEncryptedBuffer,
} from '../../src/crypto/crypto.js'

const examplePassword = 'S3cretP@ssword'
const examplePrivateKey = 'my-private-key'

describe('getSalt', () => {
  it('returns a Buffer of the correct length', () => {
    const salt = getSalt(16)
    expect(Buffer.isBuffer(salt)).toBe(true)
    expect(salt.length).toBe(16)
  })
})

describe('getSaltHex', () => {
  it('returns a hex string of expected length', () => {
    const saltHex = getSaltHex(16)
    expect(typeof saltHex).toBe('string')
    expect(saltHex.length).toBe(32) // 16 bytes → 32 hex chars
    expect(/^[0-9a-f]+$/i.test(saltHex)).toBe(true)
  })
})

describe('getEncryptedBuffer', () => {
  it('returns a Buffer of the correct derived key length', async () => {
    const salt = 'abc123'
    const buffer = await getEncryptedBuffer({
      expression: examplePassword,
      salt,
      length: 64,
    })
    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(buffer.length).toBe(64)
  })
})

describe('encrypt', () => {
  it('returns a hex string from encrypted input', async () => {
    const salt = 'abc123'
    const encrypted = await encrypt({
      expression: examplePassword,
      salt,
      passwordPrivateKey: examplePrivateKey,
    })
    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)
    expect(/^[0-9a-f]+$/i.test(encrypted)).toBe(true)
  })

  it('produces different output when private key changes', async () => {
    const salt = 'abc123'

    const encrypted1 = await encrypt({
      expression: examplePassword,
      salt,
      passwordPrivateKey: 'A',
    })

    const encrypted2 = await encrypt({
      expression: examplePassword,
      salt,
      passwordPrivateKey: 'B',
    })

    expect(encrypted1).not.toEqual(encrypted2)
  })
})

describe('isPasswordMatch', () => {
  it('returns true when password matches encrypted value', async () => {
    const salt = getSaltHex(16)
    const encrypted = await encrypt({
      expression: examplePassword,
      salt,
      passwordPrivateKey: examplePrivateKey,
    })

    const result = await isPasswordMatch({
      salt,
      password: examplePassword,
      encryptedPassword: encrypted,
      passwordPrivateKey: examplePrivateKey,
    })

    expect(result).toBe(true)
  })

  it('returns false when password does not match', async () => {
    const salt = getSaltHex(16)
    const encrypted = await encrypt({
      expression: examplePassword,
      salt,
      passwordPrivateKey: examplePrivateKey,
    })

    const result = await isPasswordMatch({
      salt,
      password: 'wrong-password',
      encryptedPassword: encrypted,
      passwordPrivateKey: examplePrivateKey,
    })

    expect(result).toBe(false)
  })

  it('returns false when private key is incorrect', async () => {
    const salt = getSaltHex(16)
    const encrypted = await encrypt({
      expression: examplePassword,
      salt,
      passwordPrivateKey: 'correct-key',
    })

    const result = await isPasswordMatch({
      salt,
      password: examplePassword,
      encryptedPassword: encrypted,
      passwordPrivateKey: 'wrong-key',
    })

    expect(result).toBe(false)
  })
})
