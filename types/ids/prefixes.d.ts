/**
 * Mapping of entity types to their unique ID prefixes.
 *
 * These prefixes are prepended to ULIDs to create consistent and identifiable IDs across the system.
 * For example: 'usr_01HZY3M7K4FJ9A8Q4Y1ZB5NX3T'
 */
export type ID_PREFIXES = string;
/**
 * Mapping of entity types to their unique ID prefixes.
 *
 * These prefixes are prepended to ULIDs to create consistent and identifiable IDs across the system.
 * For example: 'usr_01HZY3M7K4FJ9A8Q4Y1ZB5NX3T'
 *
 * @readonly
 * @enum {string}
 */
export const ID_PREFIXES: Readonly<{
    /** User entity ID prefix */
    USER: "usr";
    /** Tenant entity ID prefix */
    TENANT: "tnt";
    /** Permission entity ID prefix */
    PERMISSION: "prm";
    /** Correlation ID prefix (e.g., for tracing requests) */
    CORRELATION: "crln";
    /** Verification entity ID prefix (e.g., email/phone code) */
    VERIFICATION: "vrf";
    /** Role-permissions mapping ID prefix */
    ROLE_PERMISSIONS: "role";
    /** Onboarding mapping ID prefix */
    ONBOARDING: "onb";
    /** Session mapping ID prefix */
    SESSION: "sess";
    /** File mapping ID prefix */
    FILE: "fil";
    /** Event entity ID prefix */
    EVENT: "evt";
    /** Job entity ID prefix */
    JOB: "job";
    /** Task entity ID prefix */
    TASK: "task";
    /** Queue entity ID prefix */
    QUEUE: "que";
    /** Message entity ID prefix */
    MESSAGE: "msg";
    /** Notification entity ID prefix */
    NOTIFICATION: "ntf";
    /** Log entity ID prefix */
    LOG: "log";
    /** Audit entity ID prefix */
    AUDIT: "adt";
    /** Config entity ID prefix */
    CONFIG: "cfg";
    /** Key entity ID prefix */
    KEY: "key";
    /** Metric entity ID prefix */
    METRIC: "met";
    /** Tag entity ID prefix */
    TAG: "tag";
    /** Policy entity ID prefix */
    POLICY: "plc";
    /** Profile entity ID prefix */
    PROFILE: "prf";
    /** Device entity ID prefix */
    DEVICE: "dev";
    /** Alert entity ID prefix */
    ALERT: "alr";
    /** Resource entity ID prefix */
    RESOURCE: "res";
}>;
