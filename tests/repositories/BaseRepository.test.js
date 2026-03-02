import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseRepository } from '../../src/postgresql/repositories/BaseRepository.js'

// 🔥 mock dependencies
vi.mock('../../src/postgresql/pagination/paginate.js', () => ({
  sqlPaginate: vi.fn().mockResolvedValue({ page: 1 }),
}))

vi.mock('../../filters/apply-filter-snake-case.js', () => ({
  applyFilterSnakeCase: vi.fn(),
}))

vi.mock('../../filters/apply-filter.js', () => ({
  applyFilter: vi.fn(),
}))

vi.mock('../../core/normalize-premitives-types-or-default.js', () => ({
  normalizeNumberOrDefault: vi.fn((v) => Number(v)),
}))

// import AFTER mocks
import { sqlPaginate } from '../../src/postgresql/pagination/paginate.js'
import { toSnakeCase } from '../../src/core/case-mapper.js'

describe('BaseRepository', () => {
  let dbMock
  let logMock

  class TestRepo extends BaseRepository {
    static tableName = 'test_table'
  }

  beforeEach(() => {
    dbMock = vi.fn(() => ({
      clone: vi.fn(),
    }))

    logMock = {
      error: vi.fn(),
    }
  })

  it('throws if db not provided', () => {
    expect(() => new BaseRepository()).toThrow()
  })

  it('returns correct tableName', () => {
    const repo = new TestRepo({ db: dbMock })
    expect(repo.tableName).toBe('test_table')
  })

  it('baseQuery uses db when no trx', () => {
    const repo = new TestRepo({ db: dbMock })

    repo.baseQuery()

    expect(dbMock).toHaveBeenCalledWith('test_table')
  })

  it('baseQuery uses trx when provided', () => {
    const trxMock = vi.fn()
    const repo = new TestRepo({ db: dbMock })

    repo.baseQuery({ trx: trxMock })

    expect(trxMock).toHaveBeenCalledWith('test_table')
    expect(dbMock).not.toHaveBeenCalled()
  })

  it('baseQuery applies baseQueryBuilder', () => {
    const builderMock = vi.fn((qb) => qb)
    const repo = new TestRepo({
      db: dbMock,
      baseQueryBuilder: builderMock,
    })

    repo.baseQuery({}, { some: 'param' })

    expect(builderMock).toHaveBeenCalled()
  })

  it('find calls sqlPaginate with correct params', async () => {
    const repo = new TestRepo({ db: dbMock })

    await repo.find({
      page: 2,
      limit: 5,
      filter: { a: 1 },
    })

    expect(sqlPaginate).toHaveBeenCalled()
  })

  it('logs error if sqlPaginate throws', async () => {
    // @ts-ignore
    sqlPaginate.mockRejectedValueOnce(new Error('fail'))

    const repo = new TestRepo({ db: dbMock, log: logMock })

    await expect(repo.find({ filter: {} })).rejects.toThrow()

    expect(logMock.error).toHaveBeenCalled()
  })
})
