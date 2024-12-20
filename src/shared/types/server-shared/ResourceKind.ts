import { LiteralUnion } from 'src/shared/types/shared'
import {
  ResourceComplexKindProperty,
  ResourceComplexKindPropertyKindType,
  ResourceComplexKindSimpleTypeDefinitions,
} from './ResourceComplexKindProperty'

interface ResourceKindGeneric<Type extends ResourceComplexKindPropertyKindType> {
  type: Type
}

export interface ResourceComplexKind extends ResourceKindGeneric<'object'> {
  fqn: string
  bases?: string[]
  allow_unknown_props: boolean
  predecessor_kinds?: {
    default?: string[]
    delete?: string[]
  }
  successor_kinds?: {
    default?: string[]
    delete?: string[]
  }
  aggregate_root: boolean
  metadata?: LiteralUnion<
    {
      group?: string
      icon?: string
      name?: string
      service?: string
      description?: string
      categories?: string[]
      source?: string
      docs_url?: string
    },
    Record<string, string | string[]> | null
  >
  properties?: Record<string, ResourceComplexKindProperty>
  runtime_kind: string
}

interface ResourceSimpleKind extends ResourceKindGeneric<'simple'> {
  fqn: string
  runtime_kind: ResourceComplexKindSimpleTypeDefinitions
  enum?: string[]
}

export type ResourceKind = ResourceComplexKind | ResourceSimpleKind
