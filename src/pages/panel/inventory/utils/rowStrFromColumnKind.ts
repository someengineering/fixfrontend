import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { iso8601DurationToString, parseCustomDuration } from 'src/shared/utils/parseISO8601Duration'

export const rowStrFromColumnKind = (value: string | number | null, kind: ResourceComplexKindSimpleTypeDefinitions) => {
  switch (kind) {
    case 'duration':
      return iso8601DurationToString(parseCustomDuration((value ?? '').toString()))
    default:
      return value
  }
}
