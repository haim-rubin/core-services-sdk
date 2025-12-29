import { describe, it, expect } from 'vitest'
import { getTableNameFromQuery } from '../../../src/postgresql/core/get-table-name.js'

describe('getTableNameFromQuery', () => {
  it('extracts table name from knex query mock', () => {
    const mockQuery = {
      _single: {
        table: 'assets',
      },
    }

    // @ts-ignore
    expect(getTableNameFromQuery(mockQuery)).toBe('assets')
  })

  it('returns undefined when table is missing', () => {
    // @ts-ignore
    expect(getTableNameFromQuery({})).toBeUndefined()
  })
})
