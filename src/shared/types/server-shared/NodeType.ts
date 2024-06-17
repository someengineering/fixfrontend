export type NodeType<Data extends Record<string, unknown> = Record<string, never>> = Data & {
  type: 'node'
  id: string
}

export type EdgeType<Data extends Record<string, unknown> = Record<string, never>> = Data & {
  type: 'edge'
  from: string
  to: string
}
