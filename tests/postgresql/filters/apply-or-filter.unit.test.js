// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'

import { OPERATORS } from '../../../src/postgresql/filters/operators.js'
import { applyOrFilter } from '../../../src/postgresql/filters/apply-or-filter.js'
import * as applyFilterObjectModule from '../../../src/postgresql/filters/apply-filter-object.js'

describe('applyOrFilter (unit)', () => {
  it('applies eq operator for primitive values', () => {
    const query = {
      where: vi.fn(function (cb) {
        // @ts-ignore
        cb.call(this)

        // @ts-ignore
        return this
      }),
      orWhere: vi.fn(function (cb) {
        // @ts-ignore
        cb.call(this)

        // @ts-ignore
        return this
      }),
    }

    // @ts-ignore
    const eqSpy = vi.spyOn(OPERATORS, 'eq').mockImplementation(() => query)

    // @ts-ignore
    applyOrFilter(query, [{ name: 'A' }, { name: 'B' }], null)

    expect(eqSpy).toHaveBeenCalledTimes(2)
    expect(eqSpy).toHaveBeenCalledWith(expect.anything(), 'name', 'A')
    expect(eqSpy).toHaveBeenCalledWith(expect.anything(), 'name', 'B')
  })

  it('applies IN operator for array values', () => {
    const query = {
      where: vi.fn(function (cb) {
        // @ts-ignore
        cb.call(this)

        // @ts-ignore
        return this
      }),
      orWhere: vi.fn(function (cb) {
        // @ts-ignore
        cb.call(this)

        // @ts-ignore
        return this
      }),
    }

    // @ts-ignore
    const inSpy = vi.spyOn(OPERATORS, 'in').mockImplementation(() => query)

    // @ts-ignore
    applyOrFilter(query, [{ id: [1, 2, 3] }], null)

    expect(inSpy).toHaveBeenCalledWith(expect.anything(), 'id', [1, 2, 3])
  })

  it('delegates object values to applyFilterObject', () => {
    const query = {
      where: vi.fn(function (cb) {
        cb.call(this)
        return this
      }),
      orWhere: vi.fn(function (cb) {
        cb.call(this)
        return this
      }),
    }

    const spy = vi
      .spyOn(applyFilterObjectModule, 'applyFilterObject')
      .mockImplementation(() => query)

    applyOrFilter(query, [{ age: { gte: 18 } }], null)

    expect(spy).toHaveBeenCalledWith(expect.anything(), 'age', { gte: 18 })
  })

  it('applies snake_case when enabled', () => {
    const query = {
      where: vi.fn(function (cb) {
        // @ts-ignore
        cb.call(this)

        // @ts-ignore
        return this
      }),
      orWhere: vi.fn(function (cb) {
        // @ts-ignore
        cb.call(this)

        // @ts-ignore
        return this
      }),
    }

    // @ts-ignore
    const eqSpy = vi.spyOn(OPERATORS, 'eq').mockImplementation(() => query)

    // @ts-ignore
    applyOrFilter(query, [{ createdAt: 1 }], 't', true)

    expect(eqSpy).toHaveBeenCalledWith(expect.anything(), 't.created_at', 1)
  })
})
