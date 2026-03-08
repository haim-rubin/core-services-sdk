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
  constructor({ db, log, baseQueryBuilder }?: {})
  db: any
  log: any
  _baseQueryBuilder: any
  /**
   * Each concrete repository must define:
   * static tableName = 'table_name'
   */
  get tableName(): any
  /**
   * Builds the base knex query.
   * Applies constructor-level baseQueryBuilder if provided.
   */
  baseQuery(options: {}, params: any): any
  /**
   * Generic paginated find
   */
  find({
    page,
    limit,
    filter,
    orderBy,
    options,
    mapRow,
    ...restParams
  }: {
    [x: string]: any
    page?: number
    limit?: number
    filter?: {}
    orderBy?: {
      column: string
      direction: string
    }
    options?: {}
    mapRow?: (row: any) => any
  }): Promise<any>
}
