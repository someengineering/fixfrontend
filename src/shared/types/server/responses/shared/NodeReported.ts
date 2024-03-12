export type NodeReported = Record<string, string | number | boolean | Array<unknown> | Record<string, unknown>> & {
  ctime: string
  name: string
  age: string
  time_created?: string
  updated?: string
  last_update?: string
  id: string
  kind: string
  tags: Record<string, string>
}
