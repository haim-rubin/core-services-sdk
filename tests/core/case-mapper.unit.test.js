import { describe, it, expect } from 'vitest'

import { toSnakeCase, toCamelCase } from '../../src/core/case-mapper.js'

describe('toSnakeCase', () => {
  it('converts all keys from camelCase to snake_case', () => {
    const input = {
      userId: '1',
      createdAt: 'now',
    }

    const result = toSnakeCase(input)

    expect(result).toEqual({
      user_id: '1',
      created_at: 'now',
    })
  })

  it('converts only allowed properties when allowedProps are provided', () => {
    const input = {
      userId: '1',
      createdAt: 'now',
    }

    const result = toSnakeCase(input, ['userId'])

    expect(result).toEqual({
      user_id: '1',
    })
  })

  it('supports allowedProps passed as multiple arguments', () => {
    const input = {
      userId: '1',
      createdAt: 'now',
      updatedAt: 'later',
    }

    const result = toSnakeCase(input, 'userId', 'updatedAt')

    expect(result).toEqual({
      user_id: '1',
      updated_at: 'later',
    })
  })

  it('returns an empty object when allowedProps do not match any keys', () => {
    const input = {
      userId: '1',
    }

    const result = toSnakeCase(input, ['nonExistingKey'])

    expect(result).toEqual({})
  })
})

describe('toCamelCase', () => {
  it('converts all keys from snake_case to camelCase', () => {
    const input = {
      user_id: '1',
      created_at: 'now',
    }

    const result = toCamelCase(input)

    expect(result).toEqual({
      userId: '1',
      createdAt: 'now',
    })
  })

  it('converts only allowed properties when allowedProps are provided', () => {
    const input = {
      user_id: '1',
      created_at: 'now',
    }

    const result = toCamelCase(input, ['user_id'])

    expect(result).toEqual({
      userId: '1',
    })
  })

  it('supports allowedProps passed as multiple arguments', () => {
    const input = {
      user_id: '1',
      created_at: 'now',
      updated_at: 'later',
    }

    const result = toCamelCase(input, 'user_id', 'updated_at')

    expect(result).toEqual({
      userId: '1',
      updatedAt: 'later',
    })
  })

  it('returns an empty object when allowedProps do not match any keys', () => {
    const input = {
      user_id: '1',
    }

    const result = toCamelCase(input, ['non_existing_key'])

    expect(result).toEqual({})
  })
})
