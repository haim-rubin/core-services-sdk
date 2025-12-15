/**
 * Represents the data stored in the async context for a single execution flow.
 *
 * This object is propagated automatically across async boundaries
 * using Node.js AsyncLocalStorage.
 *
 * It defines the contract between producers (who set values)
 * and consumers (who read values) of the context.
 *
 * @typedef {Object} ContextStore
 *
 * @property {string} [correlationId] - Unique identifier for request or operation tracing.
 * @property {string} [ip] - Client IP address.
 * @property {string} [userAgent] - Client user agent string.
 * @property {string} [tenantId] - Active tenant identifier.
 * @property {string} [userId] - Authenticated user identifier.
 */
/**
 * Async execution context manager built on top of Node.js AsyncLocalStorage.
 *
 * This class provides a thin, static API for storing and accessing
 * request-scoped (or async-chain-scoped) metadata such as correlation IDs,
 * user information, tenant identifiers, and similar data.
 *
 * The context is bound to the current async execution chain using
 * AsyncLocalStorage and is automatically propagated across `await` boundaries.
 *
 * This class is intentionally static and acts as a singleton wrapper
 * around AsyncLocalStorage.
 */
export class Context {
  /**
   * Run a callback within a given async context store.
   *
   * All asynchronous operations spawned inside the callback
   * will have access to the provided store via {@link Context.get},
   * {@link Context.set}, or {@link Context.all}.
   *
   * @template T
   * @param {ContextStore} store - Initial context store for this execution.
   * @param {() => T} callback - Function to execute inside the context.
   * @returns {T} The return value of the callback (sync or async).
   *
   * @example
   * Context.run(
   *   { correlationId: 'abc123', userId: 'usr_1' },
   *   async () => {
   *     console.log(Context.get('correlationId')) // "abc123"
   *   }
   * )
   */
  static run<T>(store: ContextStore, callback: () => T): T
  /**
   * Retrieve a single value from the current async context store.
   *
   * If called outside of an active {@link Context.run},
   * this method returns `undefined`.
   *
   * @template {keyof ContextStore} K
   * @param {K} key - Context property name.
   * @returns {ContextStore[K] | undefined} The stored value, if present.
   *
   * @example
   * const tenantId = Context.get('tenantId')
   */
  static get<K extends keyof ContextStore>(key: K): ContextStore[K] | undefined
  /**
   * Set a single key-value pair on the current async context store.
   *
   * If called outside of an active {@link Context.run},
   * this method is a no-op.
   *
   * @template {keyof ContextStore} K
   * @param {K} key - Context property name.
   * @param {ContextStore[K]} value - Value to store.
   *
   * @example
   * Context.set('tenantId', 'tnt_1234')
   */
  static set<K extends keyof ContextStore>(key: K, value: ContextStore[K]): void
  /**
   * Get the full context store for the current async execution.
   *
   * If no context is active, an empty object is returned.
   *
   * @returns {ContextStore}
   *
   * @example
   * const ctx = Context.all()
   * console.log(ctx.correlationId)
   */
  static all(): ContextStore
}
/**
 * Represents the data stored in the async context for a single execution flow.
 *
 * This object is propagated automatically across async boundaries
 * using Node.js AsyncLocalStorage.
 *
 * It defines the contract between producers (who set values)
 * and consumers (who read values) of the context.
 */
export type ContextStore = {
  /**
   * - Unique identifier for request or operation tracing.
   */
  correlationId?: string
  /**
   * - Client IP address.
   */
  ip?: string
  /**
   * - Client user agent string.
   */
  userAgent?: string
  /**
   * - Active tenant identifier.
   */
  tenantId?: string
  /**
   * - Authenticated user identifier.
   */
  userId?: string
}
