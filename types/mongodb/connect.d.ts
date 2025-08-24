export function mongoConnect({ uri, serverApi }: {
    uri: string;
    serverApi?: object;
}): Promise<import("mongodb").MongoClient>;
