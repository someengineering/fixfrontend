import {
  ResourceComplexKindProperty,
  ResourceComplexKindPropertyKindType,
  ResourceComplexKindSimpleTypeDefinitions,
} from './ResourceComplexKindProperty'

export interface ResourceKindGeneric<Type extends ResourceComplexKindPropertyKindType> {
  type: Type
}

export interface ResourceComplexKind extends ResourceKindGeneric<'object'> {
  fqn: string
  bases: string[]
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
  metadata?:
    | {
        group?: string | null
        icon?: string | null
        name?: string | null
      }
    | object
    | null
  properties: Record<string, ResourceComplexKindProperty>
  runtime_kind: string
}

export interface ResourceSimpleKind extends ResourceKindGeneric<'simple'> {
  fqn: string
  runtime_kind: ResourceComplexKindSimpleTypeDefinitions
  enum?: string[]
}

export type ResourceKind = ResourceComplexKind | ResourceSimpleKind
