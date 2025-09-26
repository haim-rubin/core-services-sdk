import { describe, it, expect } from 'vitest'
import { Context } from '../../src/util/context.js'

describe('Context utility', () => {
  it('should return empty object and undefined outside run()', () => {
    expect(Context.all()).toEqual({})
    expect(Context.get('foo')).toBeUndefined()
  })

  it('should provide store values inside run()', () => {
    Context.run({ correlationId: 'abc123', userId: 'usr_1' }, () => {
      expect(Context.get('correlationId')).toBe('abc123')
      expect(Context.get('userId')).toBe('usr_1')
      expect(Context.all()).toEqual({
        correlationId: 'abc123',
        userId: 'usr_1',
      })
    })
  })

  it('should allow setting new values inside run()', () => {
    Context.run({ initial: true }, () => {
      expect(Context.get('initial')).toBe(true)
      Context.set('added', 42)
      expect(Context.get('added')).toBe(42)
      expect(Context.all()).toEqual({ initial: true, added: 42 })
    })
  })

  it('should isolate different runs()', () => {
    Context.run({ value: 'first' }, () => {
      expect(Context.get('value')).toBe('first')
    })
    Context.run({ value: 'second' }, () => {
      expect(Context.get('value')).toBe('second')
    })
  })

  it('should preserve context across async/await', async () => {
    await Context.run({ requestId: 'req-1' }, async () => {
      expect(Context.get('requestId')).toBe('req-1')

      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(Context.get('requestId')).toBe('req-1')

      await Promise.resolve().then(() => {
        expect(Context.get('requestId')).toBe('req-1')
      })
    })
  })

  it('should not leak context between async runs', async () => {
    const results = await Promise.all([
      Context.run({ user: 'alice' }, async () => {
        await new Promise((resolve) => setTimeout(resolve, 5))
        return Context.get('user')
      }),
      Context.run({ user: 'bob' }, async () => {
        await new Promise((resolve) => setTimeout(resolve, 1))
        return Context.get('user')
      }),
    ])

    expect(results).toContain('alice')
    expect(results).toContain('bob')
  })
})
