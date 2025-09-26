/**
 * Pagination with SQL-like ascending/descending
 *
 * @param {import('mongodb').Collection} collection
 * @param {Object} options
 * @param {Object} [options.filter={}]
 * @param {string} [options.cursorField='_id']
 * @param {string|Date|ObjectId} [options.cursor]
 * @param {'asc'|'desc'} [options.order='asc']
 * @param {number} [options.limit=10]
 */
export function paginate(collection: import("mongodb").Collection, { limit, projection, filter, cursor, order, cursorField, }?: {
    filter?: any;
    cursorField?: string;
    cursor?: string | Date | ObjectId;
    order?: "asc" | "desc";
    limit?: number;
}): Promise<{
    order: "desc" | "asc";
    list: import("mongodb").WithId<import("bson").Document>[];
    previous: any;
    next: any;
}>;
import { ObjectId } from 'mongodb';
