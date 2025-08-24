export function sanitizeObject(obj: any, filter: (entry: [string, any]) => boolean): any;
export function sanitizeUndefinedFields(obj: any): any;
export function sanitizeObjectAllowProps(obj: any, allowedFields?: string[]): any;
export function sanitizeObjectDisallowProps(obj: any, disallowedFields?: string[]): any;
