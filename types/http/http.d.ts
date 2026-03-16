export function get({
  url,
  headers,
  extraParams,
  expectedType,
}: HttpGetOptions): Promise<any>
export function post({
  url,
  body,
  headers,
  extraParams,
  expectedType,
}: HttpPostOptions): Promise<any>
export function put({
  url,
  body,
  headers,
  extraParams,
  expectedType,
}: HttpPutOptions): Promise<any>
export function patch({
  url,
  body,
  headers,
  extraParams,
  expectedType,
}: HttpPatchOptions): Promise<any>
export function deleteApi({
  url,
  body,
  headers,
  extraParams,
  expectedType,
}: HttpDeleteOptions): Promise<any>
export function head({
  url,
  headers,
  extraParams,
}: HttpHeadOptions): Promise<Response>
/**
 * Consolidated HTTP client with methods for common HTTP operations.
 *
 * @type {{
 *   get: (options: HttpGetOptions) => Promise<any>,
 *   put: (options: HttpPutOptions) => Promise<any>,
 *   post: (options: HttpPostOptions) => Promise<any>,
 *   patch: (options: HttpPatchOptions) => Promise<any>,
 *   head: (options: HttpHeadOptions) => Promise<Response>,
 *   deleteApi: (options: HttpDeleteOptions) => Promise<any>
 *
 * }}
 */
export const http: {
  get: (options: HttpGetOptions) => Promise<any>
  put: (options: HttpPutOptions) => Promise<any>
  post: (options: HttpPostOptions) => Promise<any>
  patch: (options: HttpPatchOptions) => Promise<any>
  head: (options: HttpHeadOptions) => Promise<Response>
  deleteApi: (options: HttpDeleteOptions) => Promise<any>
}
export type ResponseTypeValue = 'json' | 'xml' | 'text' | 'raw' | 'file'
export type HttpGetOptions = {
  /**
   * - The URL to send the request to.
   */
  url: string
  /**
   * - Optional HTTP headers.
   */
  headers?: Record<string, string>
  /**
   * - Additional fetch options.
   */
  extraParams?: RequestInit
  /**
   * - Expected response type.
   */
  expectedType?: ResponseTypeValue
}
export type HttpPostOptions = {
  /**
   * - The URL to send the request to.
   */
  url: string
  /**
   * - The request body to send.
   */
  body: any
  /**
   * - Optional HTTP headers.
   */
  headers?: Record<string, string>
  /**
   * - Additional fetch options.
   */
  extraParams?: RequestInit
  /**
   * - Expected response type.
   */
  expectedType?: ResponseTypeValue
}
export type HttpPutOptions = {
  /**
   * - The URL to send the request to.
   */
  url: string
  /**
   * - The request body to send.
   */
  body: any
  /**
   * - Optional HTTP headers.
   */
  headers?: Record<string, string>
  /**
   * - Additional fetch options.
   */
  extraParams?: RequestInit
  /**
   * - Expected response type.
   */
  expectedType?: ResponseTypeValue
}
export type HttpPatchOptions = {
  /**
   * - The URL to send the request to.
   */
  url: string
  /**
   * - The request body to send.
   */
  body: any
  /**
   * - Optional HTTP headers.
   */
  headers?: Record<string, string>
  /**
   * - Additional fetch options.
   */
  extraParams?: RequestInit
  /**
   * - Expected response type.
   */
  expectedType?: ResponseTypeValue
}
export type HttpDeleteOptions = {
  /**
   * - The URL to send the request to.
   */
  url: string
  /**
   * - Optional request body to send.
   */
  body?: any
  /**
   * - Optional HTTP headers.
   */
  headers?: Record<string, string>
  /**
   * - Additional fetch options.
   */
  extraParams?: RequestInit
  /**
   * - Expected response type.
   */
  expectedType?: ResponseTypeValue
}
export type HttpHeadOptions = {
  /**
   * - The URL to send the request to.
   */
  url: string
  /**
   * - Optional HTTP headers.
   */
  headers?: Record<string, string>
  /**
   * - Additional fetch options.
   */
  extraParams?: RequestInit
}
