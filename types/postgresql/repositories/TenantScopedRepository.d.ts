export class TenantScopedRepository extends BaseRepository {
  /**
   * Extracts and validates tenantId from filter
   */
  getRequiredTenantId(filter?: {}): any
  /**
   * Overrides find to enforce tenant presence
   */
  find(params?: {}): Promise<{
    page: number
    pages: number
    totalCount: number
    hasPrevious: boolean
    hasNext: boolean
    list: any
  }>
}
import { BaseRepository } from './BaseRepository.js'
