export function connectToPg(
  connection: object | string,
  options?: {
    pool?: object
  },
): import('knex').Knex
