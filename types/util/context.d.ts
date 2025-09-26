export namespace Context {
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
    function run<T>(store: Record<string, any>, callback: () => T): T;
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
    function get<T>(key: string): T | undefined;
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
    function set(key: string, value: any): void;
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
    function all(): Record<string, any>;
}
