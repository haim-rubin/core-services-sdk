/**
 * @typedef {Function} OperatorFunction
 * @param {import('knex').Knex.QueryBuilder} q
 * @param {string} key
 * @param {*} value
 * @returns {import('knex').Knex.QueryBuilder}
 */
/**
 * @type {Object<string, OperatorFunction>}
 */
export const OPERATORS: {
  [x: string]: Function
}
export type OperatorFunction = Function
