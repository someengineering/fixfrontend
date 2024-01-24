import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'

export function rowStrFromColumnKind(value: string | number | boolean | null, kind: 'duration'): string
export function rowStrFromColumnKind<ValueType extends string | number | boolean | null>(
  value: ValueType,
  kind: Exclude<ResourceComplexKindSimpleTypeDefinitions, 'duration'>,
): ValueType
export function rowStrFromColumnKind(
  value: string | number | boolean | null,
  kind: ResourceComplexKindSimpleTypeDefinitions,
): string | number | boolean | null
export function rowStrFromColumnKind(value: string | number | boolean | null, kind: ResourceComplexKindSimpleTypeDefinitions) {
  switch (kind) {
    // case 'duration':
    //   return iso8601DurationToString(parseCustomDuration((value ?? '').toString()))
    default:
      return typeof value === 'object' ? null : value
  }
}
