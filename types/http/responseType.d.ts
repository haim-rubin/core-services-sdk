/**
 * *
 */
export type ResponseType = string;
/**
 * Enum representing supported response types for HTTP client parsing.
 *
 * @readonly
 * @enum {string}
 * @property {string} xml  - XML response (parsed using xml2js).
 * @property {string} json - JSON response (parsed via JSON.parse).
 * @property {string} text - Plain text response.
 * @property {string} file - Binary file or blob (not automatically parsed).
 */
export const ResponseType: Readonly<{
    xml: "xml";
    json: "json";
    text: "text";
    file: "file";
}>;
