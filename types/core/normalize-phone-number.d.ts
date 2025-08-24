/** Resolve libphonenumber regardless of interop shape */
export function getLib(): any;
export function phoneUtil(): any;
/**
 * Parse & validate an international number (must start with '+').
 * @param {string} input
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If the number is invalid
 */
export function normalizePhoneOrThrowIntl(input: string): {
    e164: string;
    national: string;
    international: string;
    regionCode: string | undefined;
    type: number;
};
/**
 * Parse & validate a national number using a region hint.
 * @param {string} input
 * @param {string} defaultRegion
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If the number is invalid
 */
export function normalizePhoneOrThrowWithRegion(input: string, defaultRegion: string): {
    e164: string;
    national: string;
    international: string;
    regionCode: string | undefined;
    type: number;
};
/**
 * Smart normalization:
 * - If input starts with '+', parse as international.
 * - Otherwise require a defaultRegion and parse as national.
 * @param {string} input
 * @param {{ defaultRegion?: string }} [opts]
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If invalid or defaultRegion is missing for non-international input
 */
export function normalizePhoneOrThrow(input: string, opts?: {
    defaultRegion?: string;
}): {
    e164: string;
    national: string;
    international: string;
    regionCode: string | undefined;
    type: number;
};
