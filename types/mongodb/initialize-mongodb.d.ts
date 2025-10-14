export function initializeMongoDb({
  config,
  collectionNames,
}: {
  config: {
    uri: string
    options: {
      dbName: string
    }
  }
  collectionNames: Record<string, string>
}): Promise<
  Record<string, import('mongodb').Collection> & {
    withTransaction: <T>(action: {
      session: import('mongodb').ClientSession
    }) => Promise<T>
  }
>
