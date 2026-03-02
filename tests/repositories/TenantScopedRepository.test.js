import { describe, it, expect, vi } from 'vitest'
import { TenantScopedRepository } from '../../src/postgresql/repositories/TenantScopedRepository.js'

class TestTenantRepo extends TenantScopedRepository {
  static tableName = 'tenant_table'
}

describe('TenantScopedRepository', () => {
  const dbMock = vi.fn(() => ({}))

  it('throws if tenantId missing', async () => {
    const repo = new TestTenantRepo({ db: dbMock })

    await expect(repo.find({ filter: {} })).rejects.toThrow()
  })

  it('does not throw if tenantId exists', async () => {
    const repo = new TestTenantRepo({ db: dbMock })

    // Spy on BaseRepository.find instead of overriding repo.find
    const superSpy = vi
      .spyOn(Object.getPrototypeOf(TenantScopedRepository.prototype), 'find')
      .mockResolvedValue(true)

    const result = await repo.find({
      filter: { tenantId: 'abc' },
    })

    expect(result).toBe(true)
    expect(superSpy).toHaveBeenCalled()

    superSpy.mockRestore()
  })

  it('getRequiredTenantId returns tenantId', () => {
    const repo = new TestTenantRepo({ db: dbMock })

    const id = repo.getRequiredTenantId({
      tenantId: 'tenant-1',
    })

    expect(id).toBe('tenant-1')
  })
})
