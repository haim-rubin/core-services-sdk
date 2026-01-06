/**
 * Map of filter operators to their corresponding Knex query builder methods.
 * Each operator function applies a WHERE condition to the query.
 *
 * @type {Object<string, OperatorFunction>}
 * @private
 */
export const OPERATORS: {
  [x: string]: OperatorFunction
}
