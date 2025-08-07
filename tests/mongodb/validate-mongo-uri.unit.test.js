// @ts-nocheck
import { describe, it, expect } from 'vitest'

import { isValidMongoUri } from '../../src/mongodb/validate-mongo-uri.js'

describe('isValidMongoUri', () => {
  it('should return true for a valid mongodb:// URI', () => {
    expect(isValidMongoUri('mongodb://localhost:27017/mydb')).toBe(true)
  })

  it('should return true for a valid mongodb+srv:// URI', () => {
    expect(isValidMongoUri('mongodb+srv://cluster.example.com/test')).toBe(true)
  })

  it('should return false for non-MongoDB protocol (http)', () => {
    expect(isValidMongoUri('http://localhost')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidMongoUri('')).toBe(false)
  })

  it('should return false for whitespace string', () => {
    expect(isValidMongoUri('   ')).toBe(false)
  })

  it('should return false for non-string input', () => {
    expect(isValidMongoUri(null)).toBe(false)
    expect(isValidMongoUri(undefined)).toBe(false)
    expect(isValidMongoUri(12345)).toBe(false)
    expect(isValidMongoUri({})).toBe(false)
  })

  it('should return false for malformed URI', () => {
    expect(isValidMongoUri('mongodb://')).toBe(false)
    expect(isValidMongoUri('mongodb+srv://')).toBe(false)
    expect(isValidMongoUri('mongodb:/localhost')).toBe(false)
  })

  it('should allow valid URIs with credentials and options', () => {
    expect(
      isValidMongoUri(
        'mongodb://user:pass@localhost:27017/mydb?retryWrites=true',
      ),
    ).toBe(true)
    expect(
      isValidMongoUri(
        'mongodb+srv://user:pass@cluster0.example.mongodb.net/mydb',
      ),
    ).toBe(true)
  })
})
