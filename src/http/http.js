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
    headers: { ...JSON_HEADER, ...headers },
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
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.POST,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
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
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.PUT,
    headers: { ...JSON_HEADER, ...headers },
    body: expectedType === ResponseType.json ? JSON.stringify(body) : body,
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
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.PATCH,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
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
  const response = await fetch(url, {
    ...extraParams,
    method: HTTP_METHODS.DELETE,
    headers: { ...JSON_HEADER, ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
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
    headers: { ...JSON_HEADER, ...headers },
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
 *   deleteApi: (options: HttpDeleteOptions) => Promise<any>,
 *   head: (options: HttpHeadOptions) => Promise<Response>
 * }}
 */

export const http = {
  get,
  put,
  post,
  patch,
  deleteApi,
  head,
}
