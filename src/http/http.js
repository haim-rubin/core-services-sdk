/**
 * A lightweight HTTP client wrapper around Node.js native fetch
 * supporting JSON, XML, and plain text responses.
 * Provides simplified helper methods for GET, POST, PUT, PATCH, and DELETE
 * with automatic error handling.
 *
 * @module http
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
  status >= httpStatus.OK && status < httpStatus.MULTIPLE_CHOICES

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
    default:
      return getTextResponse(response)
  }
}

/**
 * Sends an HTTP GET request.
 */
export const get = async ({
  url,
  headers = {},
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.GET,
    headers: { ...JSON_HEADER, ...headers },
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP POST request.
 */
export const post = async ({
  url,
  body,
  headers = {},
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.POST,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP PUT request.
 */
export const put = async ({
  url,
  body,
  headers = {},
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.PUT,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP PATCH request.
 */
export const patch = async ({
  url,
  body,
  headers = {},
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.PATCH,
    headers: { ...JSON_HEADER, ...headers },
    body: JSON.stringify(body),
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Sends an HTTP DELETE request.
 */
export const deleteApi = async ({
  url,
  body,
  headers = {},
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.DELETE,
    headers: { ...JSON_HEADER, ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  await checkStatus(response)
  return getResponsePayload(response, expectedType)
}

/**
 * Consolidated HTTP client.
 */
export const http = {
  get,
  put,
  post,
  patch,
  deleteApi,
}
