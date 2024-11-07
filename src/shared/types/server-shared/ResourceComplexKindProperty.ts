export type ResourceComplexKindSimpleTypeDefinitions =
  | 'string'
  | 'int32'
  | 'int64'
  | 'float'
  | 'double'
  | 'boolean'
  | 'any'
  | 'duration'
  | 'datetime'
  | 'date'

export type ResourceComplexKindPropertyKindType = 'object' | 'array' | 'dictionary' | 'simple'

interface ResourceComplexKindPropertyKindGeneric<Type extends ResourceComplexKindPropertyKindType> {
  type: Type
}

interface ResourceComplexKindPropertyKindObject extends ResourceComplexKindPropertyKindGeneric<'object'> {
  fqn: string
}

interface ResourceComplexKindPropertyKindArray extends ResourceComplexKindPropertyKindGeneric<'array'> {
  items: ResourceComplexKindPropertyKind
}

interface ResourceComplexKindPropertyKindDictionary extends ResourceComplexKindPropertyKindGeneric<'dictionary'> {
  key: ResourceComplexKindPropertyKind
  value: ResourceComplexKindPropertyKind
}

interface ResourceComplexKindPropertyKindSimple extends ResourceComplexKindPropertyKindGeneric<'simple'> {
  fqn: ResourceComplexKindSimpleTypeDefinitions
}

export type ResourceComplexKindPropertyKind =
  | ResourceComplexKindPropertyKindObject
  | ResourceComplexKindPropertyKindArray
  | ResourceComplexKindPropertyKindDictionary
  | ResourceComplexKindPropertyKindSimple

export interface ResourceComplexKindProperty {
  kind: ResourceComplexKindPropertyKind
  required: boolean
  description?: string | null
  metadata?: unknown
}
