import { sqlPaginate } from '../pagination/paginate.js'
import { toSnakeCase } from '../../core/case-mapper.js'

/**
 * BaseRepository
 *
 * Provides:
 * - tableName getter (static + instance support)
 * - baseQuery(options)
 * - constructor-level query shaping (optional)
 * - generic find() with pagination
 *
 * Does NOT enforce tenant isolation.
 */

export class BaseRepository {
  constructor({ db, log, columns, baseQueryBuilder } = {}) {
    if (!db) {
      throw new Error('BaseRepository requires db instance')
    }

    this.db = db
    this.log = log
    this._columns = columns ?? '*'
    this._baseQueryBuilder = baseQueryBuilder
  }

  /**
   * Each concrete repository must define:
   * static tableName = 'table_name'
   */
  get tableName() {
    if (!this.constructor.tableName) {
      throw new Error(`tableName not defined for ${this.constructor.name}`)
    }

    return this.constructor.tableName
  }

  /**
   * Builds the base knex query.
   * Applies constructor-level baseQueryBuilder if provided.
   */
  baseQuery(options = {}, params) {
    const { trx } = options
    const connection = trx || this.db

    const qb = connection(this.tableName)

    if (this._baseQueryBuilder) {
      // Pass full params for optional dynamic shaping
      this._baseQueryBuilder(qb, params)
    }

    return qb
  }

  /**
   * Generic paginated find
   */
  async find({
    page = 1,
    columns,
    limit = 10,
    filter = {},
    options = {},
    mapRow = (row) => row,
    orderBy = { column: 'created_at', direction: 'desc' },
    ...restParams
  }) {
    try {
      const qb = this.baseQuery(options, {
        page,
        limit,
        filter,
        orderBy,
        options,
        ...restParams,
      })

      return await sqlPaginate({
        page,
        limit,
        mapRow,
        orderBy,
        baseQuery: qb,
        filter: toSnakeCase(filter),
        columns: columns ?? this._columns,
      })
    } catch (error) {
      if (this.log) {
        this.log.error({ error }, `Error finding from ${this.tableName}`)
      }

      throw error
    }
  }
}
