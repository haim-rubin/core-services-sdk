import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BaseRepository } from '../../src/postgresql/repositories/BaseRepository.js'

// mock paginate
vi.mock('../../src/postgresql/pagination/paginate.js', () => ({
  sqlPaginate: vi.fn(),
}))

// mock snakeCase mapper
vi.mock('../../src/core/case-mapper.js', () => ({
  toSnakeCase: vi.fn((v) => v),
}))

// import AFTER mocks
import { sqlPaginate } from '../../src/postgresql/pagination/paginate.js'
import { toSnakeCase } from '../../src/core/case-mapper.js'

describe('BaseRepository', () => {
  let dbMock
  let qbMock
  let logMock

  class TestRepo extends BaseRepository {
    static tableName = 'test_table'
  }

  beforeEach(() => {
    qbMock = {
      clone: vi.fn().mockReturnThis(),
    }

    dbMock = vi.fn(() => qbMock)

    logMock = {
      error: vi.fn(),
    }

    sqlPaginate.mockResolvedValue({ page: 1 })
  })

  afterEach(() => {
    vi.clearAllMocks()
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
    const trxMock = vi.fn(() => qbMock)
    const repo = new TestRepo({ db: dbMock })

    repo.baseQuery({ trx: trxMock })

    expect(trxMock).toHaveBeenCalledWith('test_table')
    expect(dbMock).not.toHaveBeenCalled()
  })

  it('baseQuery applies baseQueryBuilder', () => {
    const builderMock = vi.fn()

    const repo = new TestRepo({
      db: dbMock,
      baseQueryBuilder: builderMock,
    })

    repo.baseQuery({}, { some: 'param' })

    expect(builderMock).toHaveBeenCalledWith(qbMock, { some: 'param' })
  })

  it('find calls sqlPaginate with correct params', async () => {
    const repo = new TestRepo({ db: dbMock })

    await repo.find({
      page: 2,
      limit: 5,
      filter: { a: 1 },
    })

    expect(toSnakeCase).toHaveBeenCalledWith({ a: 1 })

    expect(sqlPaginate).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        limit: 5,
        baseQuery: qbMock,
      }),
    )
  })

  it('logs error if sqlPaginate throws', async () => {
    sqlPaginate.mockRejectedValueOnce(new Error('fail'))

    const repo = new TestRepo({ db: dbMock, log: logMock })

    await expect(repo.find({ filter: {} })).rejects.toThrow('fail')

    expect(logMock.error).toHaveBeenCalled()
  })

  it('find uses columns passed to find()', async () => {
    const repo = new TestRepo({ db: dbMock })

    await repo.find({
      columns: ['id', 'name'],
    })

    expect(sqlPaginate).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: ['id', 'name'],
      }),
    )
  })

  it('find falls back to constructor columns', async () => {
    const repo = new TestRepo({
      db: dbMock,
      columns: ['id', 'email'],
    })

    await repo.find({})

    expect(sqlPaginate).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: ['id', 'email'],
      }),
    )
  })

  it('find falls back to "*" when no columns provided', async () => {
    const repo = new TestRepo({ db: dbMock })

    await repo.find({})

    expect(sqlPaginate).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: '*',
      }),
    )
  })
})
