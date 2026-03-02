/**
 * TenantScopedRepository
 *
 * Extends BaseRepository
 * Enforces tenantId presence inside filter.
 *
 * Does NOT modify filter.
 * Does NOT rebuild filter.
 * Only validates existence.
 */

import { BaseRepository } from './BaseRepository.js'

export class TenantScopedRepository extends BaseRepository {
  /**
   * Extracts and validates tenantId from filter
   */
  getRequiredTenantId(filter = {}) {
    const { tenantId } = filter

    if (!tenantId) {
      throw new Error(
        `Scoped repository (${this.tableName}), tenantId is required`,
      )
    }

    return tenantId
  }

  /**
   * Overrides find to enforce tenant presence
   */
  async find(params = {}) {
    const { filter = {} } = params

    this.getRequiredTenantId(filter)

    return super.find(params)
  }
}
