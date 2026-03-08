export class TenantScopedRepository extends BaseRepository {
  /**
   * Extracts and validates tenantId from filter
   */
  getRequiredTenantId(filter?: {}): any
  /**
   * Overrides find to enforce tenant presence
   */
  find(params?: {}): Promise<any>
}
import { BaseRepository } from './BaseRepository.js'
