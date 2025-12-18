export function sqlPaginate({
  db,
  mapRow,
  orderBy,
  page,
  limit,
  tableName,
  filter,
}?: {
  db: any
  tableName: string
  page?: number
  limit?: number
  filter?: any
  orderBy?: {
    column: string
    direction?: 'asc' | 'desc'
  }
}): Promise<{
  list: any[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrevious: boolean
}>
