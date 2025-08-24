/**
 * Validates whether a given string is a properly formatted MongoDB URI.
 *
 * Supports both standard (`mongodb://`) and SRV (`mongodb+srv://`) protocols.
 *
 * @param {string} uri - The URI string to validate.
 * @returns {boolean} `true` if the URI is a valid MongoDB connection string, otherwise `false`.
 *
 * @example
 * isValidMongoUri('mongodb://localhost:27017/mydb') // true
 * isValidMongoUri('mongodb+srv://cluster.example.com/test') // true
 * isValidMongoUri('http://localhost') // false
 * isValidMongoUri('') // false
 */
export function isValidMongoUri(uri: string): boolean;
