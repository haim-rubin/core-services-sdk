/**
 * A lightweight HTTP client wrapper around Node.js native fetch
 * supporting JSON, XML, and plain text responses.
 * Provides simplified helper methods for GET, POST, PUT, PATCH, and DELETE
 * with automatic error handling.
 *
 * @module http
 */

/**
 * @typedef {'json' | 'xml' | 'text' | 'raw' | 'file'} ResponseTypeValue
 */

/**
 * @typedef {Object} HttpGetOptions
 * @property {string} url - The URL to send the request to.
 * @property {Record<string, string>} [headers] - Optional HTTP headers.
 * @property {RequestInit} [extraParams] - Additional fetch options.
 * @property {ResponseTypeValue} [expectedType] - Expected response type.
 */

/**
 * @typedef {Object} HttpPostOptions
 * @property {string} url - The URL to send the request to.
 * @property {any} body - The request body to send.
 * @property {Record<string, string>} [headers] - Optional HTTP headers.
 * @property {RequestInit} [extraParams] - Additional fetch options.
 * @property {ResponseTypeValue} [expectedType] - Expected response type.
 */

/**
 * @typedef {Object} HttpPutOptions
 * @property {string} url - The URL to send the request to.
 * @property {any} body - The request body to send.
 * @property {Record<string, string>} [headers] - Optional HTTP headers.
 * @property {RequestInit} [extraParams] - Additional fetch options.
 * @property {ResponseTypeValue} [expectedType] - Expected response type.
 */

/**
 * @typedef {Object} HttpPatchOptions
 * @property {string} url - The URL to send the request to.
 * @property {any} body - The request body to send.
 * @property {Record<string, string>} [headers] - Optional HTTP headers.
 * @property {RequestInit} [extraParams] - Additional fetch options.
 * @property {ResponseTypeValue} [expectedType] - Expected response type.
 */

/**
 * @typedef {Object} HttpDeleteOptions
 * @property {string} url - The URL to send the request to.
 * @property {any} [body] - Optional request body to send.
 * @property {Record<string, string>} [headers] - Optional HTTP headers.
 * @property {RequestInit} [extraParams] - Additional fetch options.
 * @property {ResponseTypeValue} [expectedType] - Expected response type.
 */

/**
 * @typedef {Object} HttpHeadOptions
 * @property {string} url - The URL to send the request to.
 * @property {Record<string, string>} [headers] - Optional HTTP headers.
 * @property {RequestInit} [extraParams] - Additional fetch options.
 */

import httpStatus from 'http-status'
import { parseStringPromise } from 'xml2js'

import { HttpError } from './HttpError.js'
import { HTTP_METHODS } from './http-method.js'
import { ResponseType } from './responseType.js'

const JSON_HEADER = {
  'Content-Type': 'application/json',
}

/**
 * Checks if the HTTP status is considered successful (2xx).
 *
 * @param {Response} response
 * @returns {boolean}
 */
const isOkStatus = ({ status }) =>
  status >= httpStatus.OK && status < httpStatus.BAD_REQUEST

/**
 * Ensures the response has a successful status, otherwise throws HttpError.
 *
 * @param {Response} response
 * @returns {Promise<Response>}
 */
const checkStatus = async (response) => {
  if (!isOkStatus(response)) {
    const text = await response.text()
    const { status } = response
    throw new HttpError({
      status,
      code: status,
      extendInfo: { text },
    })
  }
  return response
}

/**
 * Reads the raw text from a fetch response.
 *
 * @param {Response} response
 * @returns {Promise<string>}
 */
const getTextResponse = async (response) => response.text()

/**
 * Attempts to parse a JSON string.
 *
 * @param {string} responseText
 * @returns {Object}
 * @throws {SyntaxError} If not valid JSON.
 */
const tryConvertJsonResponse = (responseText) => {
  try {
    return JSON.parse(responseText)
  } catch (error) {
    error.responseText = responseText
    throw error
  }
}

/**
 * Extracts JSON from a response, or returns raw text on failure.
 *
 * @param {Response} response
 * @returns {Promise<Object|string>}
 */
const tryGetJsonResponse = async (response) => {
  let jsonText
  try {
    jsonText = await getTextResponse(response)
    return tryConvertJsonResponse(jsonText)
  } catch (error) {
    if (!jsonText) {
      throw error
    }
    return jsonText
  }
}

/**
 * Extracts XML from a response, or returns raw text on failure.
 *
 * @param {Response} response
 * @returns {Promise<Object|string>}
 */
const tryGetXmlResponse = async (response) => {
  let xmlText
  try {
    xmlText = await getTextResponse(response)
    return await parseStringPromise(xmlText)
  } catch (error) {
    if (!xmlText) {
      throw error
    }
    return xmlText
  }
}

/**
 * Parses the fetch response based on expected type.
 *
 * @param {Response} response
 * @param {string} responseType
 * @returns {Promise<any>}
 */
const getResponsePayload = async (response, responseType) => {
  switch (responseType) {
    case ResponseType.json:
      return tryGetJsonResponse(response)
    case ResponseType.xml:
      return tryGetXmlResponse(response)
    case ResponseType.raw:
      return response
    default:
      return getTextResponse(response)
  }
}

/**
 * Checks if value is a Node.js Readable stream.
 *
 * @param {any} value
 * @returns {boolean}
 */
const isReadableStream = (value) => {
  return value && typeof value === 'object' && typeof value.pipe === 'function'
}

/**
 * Checks if value is a TypedArray (Uint8Array, etc).
 *
 * @param {any} value
 * @returns {boolean}
 */
const isTypedArray = (value) => {
  return ArrayBuffer.isView(value)
}

/**
 * Normalizes the request body before sending it via fetch.
 *
 * Ensures backward compatibility while allowing additional body types.
 * - undefined/null → no body sent
 * - string → sent as-is
 * - URLSearchParams → sent as-is (fetch serializes automatically)
 * - FormData → sent as-is (fetch sets multipart boundary automatically)
 * - ArrayBuffer / Blob → sent as-is
 * - Buffer → sent as-is
 * - TypedArray → sent as-is
 * - Readable stream → sent as-is
 * - object / array → JSON.stringify applied and Content-Type ensured
 *
 * @param {any} body
 * @param {Record<string,string>} headers
 * @returns {{ body:any, headers:Record<string,string> }}
 */
const prepareRequestBody = (body, headers = {}) => {
  if (body === undefined || body === null) {
    return { body: undefined, headers }
  }

  if (typeof body === 'string') {
    return { body, headers }
  }

  if (body instanceof URLSearchParams) {
    return { body, headers }
  }

  if (body instanceof FormData) {
    return { body, headers }
  }

  if (Buffer.isBuffer(body)) {
    return { body, headers }
  }

  if (body instanceof ArrayBuffer) {
    return { body, headers }
  }

  if (isTypedArray(body)) {
    return { body, headers }
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return { body, headers }
  }

  if (isReadableStream(body)) {
    return { body, headers }
  }

  if (typeof body === 'object') {
    return {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  }

  return { body, headers }
}

/**
 * Resolves headers safely based on body type.
 *
 * Adds default headers only when no Content-Type is provided
 * AND the body is a plain JSON object or array.
 *
 * @param {Record<string,string>} preparedHeaders
 * @param {any} body
 * @param {Record<string,string>} defaultHeaders
 * @returns {Record<string,string>}
 */
const resolveHeaders = (
  preparedHeaders = {},
  body,
  defaultHeaders = JSON_HEADER,
) => {
  const hasContentType = Object.keys(preparedHeaders).some(
    (key) => key.toLowerCase() === 'content-type',
  )

  if (hasContentType) {
    return preparedHeaders
  }

  const isPlainObject =
    body !== null && typeof body === 'object' && body.constructor === Object

  const isArray = Array.isArray(body)

  const isJsonCandidate = isPlainObject || isArray

  if (!isJsonCandidate) {
    return preparedHeaders
  }

  return {
    ...defaultHeaders,
    ...preparedHeaders,
  }
}

/**
 * Sends an HTTP GET request.
 *
 * @param {HttpGetOptions} options - The request options.
 * @returns {Promise<any>} The parsed response based on expectedType.
 * @throws {HttpError} If the response status is not successful.
 */
export const get = async ({
  url,
  headers = {},
  extraParams = {},
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.GET,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP POST request.
 *
 * @param {HttpPostOptions} options - The request options.
 * @returns {Promise<any>} The parsed response based on expectedType.
 * @throws {HttpError} If the response status is not successful.
 */
export const post = async ({
  url,
  body,
  headers = {},
  extraParams = {},
  expectedType = ResponseType.json,
}) => {
  const { body: preparedBody, headers: preparedHeaders } = prepareRequestBody(
    body,
    headers,
  )
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.POST,
    headers: resolveHeaders(preparedHeaders, body),
    body: preparedBody,
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP PUT request.
 *
 * @param {HttpPutOptions} options - The request options.
 * @returns {Promise<any>} The parsed response based on expectedType.
 * @throws {HttpError} If the response status is not successful.
 */
export const put = async ({
  url,
  body,
  headers = {},
  extraParams = {},
  expectedType = ResponseType.json,
}) => {
  const { body: preparedBody, headers: preparedHeaders } = prepareRequestBody(
    body,
    headers,
  )
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.PUT,
    headers: resolveHeaders(preparedHeaders, body),
    body: preparedBody,
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP PATCH request.
 *
 * @param {HttpPatchOptions} options - The request options.
 * @returns {Promise<any>} The parsed response based on expectedType.
 * @throws {HttpError} If the response status is not successful.
 */
export const patch = async ({
  url,
  body,
  headers = {},
  extraParams = {},
  expectedType = ResponseType.json,
}) => {
  const { body: preparedBody, headers: preparedHeaders } = prepareRequestBody(
    body,
    headers,
  )
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.PATCH,
    headers: resolveHeaders(preparedHeaders, body),
    body: preparedBody,
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP DELETE request.
 *
 * @param {HttpDeleteOptions} options - The request options.
 * @returns {Promise<any>} The parsed response based on expectedType.
 * @throws {HttpError} If the response status is not successful.
 */
export const deleteApi = async ({
  url,
  body,
  headers = {},
  extraParams = {},
  expectedType = ResponseType.json,
}) => {
  const { body: preparedBody, headers: preparedHeaders } = prepareRequestBody(
    body,
    headers,
  )
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.DELETE,
    headers: resolveHeaders(preparedHeaders, body),
    ...(preparedBody ? { body: preparedBody } : {}),
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP HEAD request.
 *
 * @param {HttpHeadOptions} options - The request options.
 * @returns {Promise<Response>} The raw fetch response (headers only).
 * @throws {HttpError} If the response status is not successful.
 */
export const head = async ({ url, headers = {}, extraParams = {} }) => {
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.HEAD,
    headers,
  })

  await checkStatus(response)

  return response
}

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

export const http = {
  get,
  put,
  post,
  head,
  patch,
  deleteApi,
}
