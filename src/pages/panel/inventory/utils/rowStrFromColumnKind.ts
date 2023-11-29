import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { iso8601DurationToString, parseCustomDuration } from 'src/shared/utils/parseDuration'

export const rowStrFromColumnKind = (value: string | number | boolean | null, kind: ResourceComplexKindSimpleTypeDefinitions) => {
  switch (kind) {
    case 'duration':
      return iso8601DurationToString(parseCustomDuration((value ?? '').toString()))
    default:
      return value
  }
}
