export function get({ url, headers, expectedType, }: {
    url: any;
    headers?: {};
    expectedType?: "json";
}): Promise<any>;
export function post({ url, body, headers, expectedType, }: {
    url: any;
    body: any;
    headers?: {};
    expectedType?: "json";
}): Promise<any>;
export function put({ url, body, headers, expectedType, }: {
    url: any;
    body: any;
    headers?: {};
    expectedType?: "json";
}): Promise<any>;
export function patch({ url, body, headers, expectedType, }: {
    url: any;
    body: any;
    headers?: {};
    expectedType?: "json";
}): Promise<any>;
export function deleteApi({ url, body, headers, expectedType, }: {
    url: any;
    body: any;
    headers?: {};
    expectedType?: "json";
}): Promise<any>;
export namespace http {
    export { get };
    export { put };
    export { post };
    export { patch };
    export { deleteApi };
}
