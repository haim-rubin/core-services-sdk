import fetch from 'node-fetch'
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
 * @param {Response} res - The fetch response object.
 * @returns {boolean} `true` if status code is between 200-299.
 */
const isOkStatus = ({ status }) =>
  status >= httpStatus.OK && status < httpStatus.MULTIPLE_CHOICES

/**
 * Verifies response status and throws a structured HttpError if not OK.
 *
 * @param {Response} res - The fetch response object.
 * @throws {HttpError} When the response status is not OK.
 * @returns {Response} The response if status is OK.
 */
const checkStatus = async (res) => {
  if (!isOkStatus(res)) {
    const text = await res.text()
    const info = tryConvertJsonResponse(text)
    const { status, statusText } = res

    throw new HttpError({
      code: status,
      httpStatusCode: status,
      httpStatusText: statusText,
      details: info,
    })
  }
  return res
}

/**
 * Reads the raw text from a fetch response.
 *
 * @param {Response} response - The fetch response.
 * @returns {Promise<string>} The text body.
 */
const getTextResponse = async (response) => {
  return await response.text()
}

/**
 * Attempts to parse a JSON string.
 *
 * @param {string} responseText - A raw JSON string.
 * @returns {Object} Parsed JSON object.
 * @throws {SyntaxError} If the string is not valid JSON.
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
 * Attempts to extract a JSON object from a fetch response.
 *
 * @param {Response} response - The fetch response.
 * @returns {Promise<Object|string>} Parsed object or raw string on failure.
 */
const tryGetJsonResponse = async (response) => {
  let jsonText
  try {
    jsonText = await getTextResponse(response)
    return tryConvertJsonResponse(jsonText)
  } catch (error) {
    if (!jsonText) throw error
    return jsonText
  }
}

/**
 * Attempts to extract an XML object from a fetch response.
 *
 * @param {Response} response - The fetch response.
 * @returns {Promise<Object|string>} Parsed XML object or raw string.
 */
const tryGetXmlResponse = async (response) => {
  let xmlText
  try {
    xmlText = await getTextResponse(response)
    return await parseStringPromise(xmlText)
  } catch (error) {
    if (!xmlText) throw error
    return xmlText
  }
}

/**
 * Extracts and parses the fetch response body based on expected type.
 *
 * @param {Response} response - The fetch response.
 * @param {string} responseType - The expected response type ('json', 'xml', 'text').
 * @returns {Promise<any>} The parsed response payload.
 */
const getResponsePayload = async (response, responseType) => {
  switch (responseType) {
    case ResponseType.json:
      return tryGetJsonResponse(response)
    case ResponseType.xml:
      return tryGetXmlResponse(response)
    default:
    case ResponseType.text:
      return getTextResponse(response)
  }
}

/**
 * Sends an HTTP GET request.
 *
 * @param {Object} params
 * @param {string} params.url - The target URL.
 * @param {Object} [params.headers] - Optional custom headers.
 * @param {string} [params.credentials='include'] - Credential mode.
 * @param {string} [params.expectedType='json'] - Response type.
 * @returns {Promise<any>} Parsed response data.
 */
export const get = async ({
  url,
  headers = {},
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.GET,
    headers: { ...JSON_HEADER, ...headers },
    ...(credentials ? { credentials } : {}),
  })
  await checkStatus(response)
  return await getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP POST request.
 *
 * @param {Object} params
 * @param {string} params.url - The target URL.
 * @param {Object} params.body - Body data to send.
 * @param {Object} [params.headers] - Optional custom headers.
 * @param {string} [params.credentials='include'] - Credential mode.
 * @param {string} [params.expectedType='json'] - Response type.
 * @returns {Promise<any>} Parsed response data.
 */
export const post = async ({
  url,
  body,
  headers,
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.POST,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
    ...(credentials ? { credentials } : {}),
  })
  await checkStatus(response)
  return await getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP PUT request.
 *
 * @param {Object} params - Same as `post`.
 * @returns {Promise<any>} Parsed response data.
 */
export const put = async ({
  url,
  body,
  headers = {},
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.PUT,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
    ...(credentials ? { credentials } : {}),
  })
  await checkStatus(response)
  return await getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP PATCH request.
 *
 * @param {Object} params - Same as `post`.
 * @returns {Promise<any>} Parsed response data.
 */
export const patch = async ({
  url,
  body,
  headers,
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.PATCH,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
    ...(credentials ? { credentials } : {}),
  })
  await checkStatus(response)
  return await getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP DELETE request.
 *
 * @param {Object} params - Same as `post`, but body is optional.
 * @returns {Promise<any>} Parsed response data.
 */
export const deleteApi = async ({
  url,
  body,
  headers,
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.DELETE,
    headers: { ...JSON_HEADER, ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(credentials ? { credentials } : {}),
  })
  await checkStatus(response)
  return await getResponsePayload(response, expectedType)
}

/**
 * Consolidated HTTP client with method shortcuts.
 *
 * @namespace http
 * @property {Function} get - HTTP GET method.
 * @property {Function} post - HTTP POST method.
 * @property {Function} put - HTTP PUT method.
 * @property {Function} patch - HTTP PATCH method.
 * @property {Function} deleteApi - HTTP DELETE method.
 */
export const http = {
  get,
  put,
  post,
  patch,
  deleteApi,
}
