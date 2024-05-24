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

export interface ResourceComplexKindPropertyKindGeneric<Type extends ResourceComplexKindPropertyKindType> {
  type: Type
}

export interface ResourceComplexKindPropertyKindObject extends ResourceComplexKindPropertyKindGeneric<'object'> {
  fqn: string
}

export interface ResourceComplexKindPropertyKindArray extends ResourceComplexKindPropertyKindGeneric<'array'> {
  items: ResourceComplexKindPropertyKind
}

export interface ResourceComplexKindPropertyKindDictionary extends ResourceComplexKindPropertyKindGeneric<'dictionary'> {
  key: ResourceComplexKindPropertyKind
  value: ResourceComplexKindPropertyKind
}

export interface ResourceComplexKindPropertyKindSimple extends ResourceComplexKindPropertyKindGeneric<'simple'> {
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
