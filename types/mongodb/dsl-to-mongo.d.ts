/**
 * Convert a normalized query object into a MongoDB query object.
 *
 * @param {Record<string, any>} query - normalized DSL query
 * @returns {Record<string, any>} - MongoDB query object
 */
export function toMongo(query?: Record<string, any>): Record<string, any>;
