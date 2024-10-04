import { LiteralUnion } from 'src/shared/types/shared'

export type NodeAncestors = Record<LiteralUnion<'account' | 'cloud', string>, { reported: { name: string; id: string } }>
