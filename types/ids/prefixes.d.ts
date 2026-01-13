/**
 * Mapping of entity types to their unique ID prefixes.
 *
 * Prefixes are prepended to ULIDs to create readable,
 * sortable, and easily identifiable IDs across the system.
 *
 * Example:
 *   ast_01HZY3M7K4FJ9A8Q4Y1ZB5NX3T
 */
export type ID_PREFIXES = string
/**
 * Mapping of entity types to their unique ID prefixes.
 *
 * Prefixes are prepended to ULIDs to create readable,
 * sortable, and easily identifiable IDs across the system.
 *
 * Example:
 *   ast_01HZY3M7K4FJ9A8Q4Y1ZB5NX3T
 *
 * @readonly
 * @enum {string}
 */
export const ID_PREFIXES: Readonly<{
  USER: 'usr'
  TENANT: 'tnt'
  SESSION: 'sess'
  ONBOARDING: 'onb'
  ROLE: 'role'
  PERMISSION: 'prm'
  ROLE_PERMISSION: 'rprm'
  VERIFICATION: 'vrf'
  POLICY: 'plc'
  PROFILE: 'prf'
  DEVICE: 'dev'
  ASSET: 'ast'
  ASSET_UPLOAD: 'aupl'
  FILE: 'fil'
  SUPPLIER: 'sup'
  INVOICE: 'inv'
  INVOICE_ITEM: 'invi'
  INVOICE_CORRECTION: 'invc'
  CUSTOMER: 'cust'
  PAYMENT: 'pay'
  TRANSACTION: 'txn'
  RECEIPT: 'rcp'
  INVOICE_RECEIPT: 'invrcp'
  CREDIT_NOTE: 'crn'
  DEBIT_NOTE: 'dbn'
  PROFORMA_INVOICE: 'pfi'
  DELIVERY_NOTE: 'dln'
  ORDER: 'ord'
  QUOTE: 'qte'
  COUNTERPARTY: 'ctp'
  DOCUMENT_DATA: 'docd'
  CORRELATION: 'crln'
  EVENT: 'evt'
  JOB: 'job'
  TASK: 'task'
  QUEUE: 'que'
  MESSAGE: 'msg'
  NOTIFICATION: 'ntf'
  EMAIL: 'eml'
  INCOMING_EMAIL: 'ieml'
  IM: 'im'
  AUDIT: 'adt'
  LOG: 'log'
  METRIC: 'met'
  TAG: 'tag'
  CONFIG: 'cfg'
  KEY: 'key'
  RESOURCE: 'res'
  ALERT: 'alr'
  BOT_FLOW: 'botf'
}>
