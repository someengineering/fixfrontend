export type NodeReported = Record<string, string | number | boolean | Array<unknown> | Record<string, unknown>> & {
  account?: string
  node_id?: string
  cloud?: string
  ctime: string
  mtime?: string
  name: string
  region?: string
  age: string
  time_created?: string
  updated?: string
  last_update?: string
  id: string
  kind: string
  tags: Record<string, string>
}
