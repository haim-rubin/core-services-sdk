import { AsyncLocalStorage } from 'node:async_hooks'

const als = new AsyncLocalStorage()

/**
 * Context utility built on top of Node.js AsyncLocalStorage.
 * Provides a per-request (or per-async-chain) storage mechanism that
 * allows passing metadata (like correlation IDs, user info, tenant ID, etc.)
 * without explicitly threading it through every function call.
 */

export const Context = {
  /**
   * Run a callback within a given context store.
   * Everything `await`ed or invoked inside this callback will have access
   * to the provided store via {@link Context.get}, {@link Context.set}, or {@link Context.all}.
   *
   * @template T
   * @param {Record<string, any>} store
   * @param {() => T} callback - Function to execute inside the context.
   * @returns {T} The return value of the callback (sync or async).
   *
   * @example
   * Context.run(
   *   { correlationId: 'abc123' },
   *   async () => {
   *     console.log(Context.get('correlationId')) // "abc123"
   *   }
   * )
   */
  run(store, callback) {
    return als.run(store, callback)
  },

  /**
   * Retrieve a single value from the current async context store.
   *
   * @template T
   * @param {string} key - The key of the value to retrieve.
   * @returns {T|undefined} The stored value, or `undefined` if no store exists or key not found.
   *
   * @example
   * const userId = Context.get('userId')
   */
  get(key) {
    const store = als.getStore()
    return store?.[key]
  },

  /**
   * Set a single key-value pair in the current async context store.
   * If there is no active store (i.e. outside of a {@link Context.run}),
   * this function does nothing.
   *
   * @param {string} key - The key under which to store the value.
   * @param {any} value - The value to store.
   *
   * @example
   * Context.set('tenantId', 'tnt_1234')
   */
  set(key, value) {
    const store = als.getStore()
    if (store) {
      store[key] = value
    }
  },

  /**
   * Get the entire store object for the current async context.
   *
   * @returns {Record<string, any>} The current store object,
   * or an empty object if no store exists.
   *
   * @example
   * const all = Context.all()
   * console.log(all) // { correlationId: 'abc123', userId: 'usr_789' }
   */
  all() {
    return als.getStore() || {}
  },
}
