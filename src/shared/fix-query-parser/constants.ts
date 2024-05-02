export const booleanOPTypes = ['=', '!='] as const

export const durationOpTypes = ['>', '>=', '<', '<='] as const

export const arrayOpTypes = ['in', 'not in'] as const

export const numberOpTypes = [...durationOpTypes, ...arrayOpTypes] as const

export const stringOPTypes = [...arrayOpTypes, '~', '!~'] as const

export const opTypes = [...stringOPTypes, ...booleanOPTypes, ...durationOpTypes]

export const kindDurationTypes = ['duration', 'datetime', 'date'] as const

export const stringSimpleTypes = ['string', ...kindDurationTypes] as const

export const kindNumberTypes = ['int32', 'int64', 'float', 'double'] as const

export const kindSimpleTypes = ['any', 'boolean', ...kindNumberTypes, ...stringSimpleTypes] as const

export type OPType = (typeof opTypes)[number]

export const defaultProperties: { key: string; label: string; value: string; isDefaulted?: boolean }[] = [
  { key: 'Tags', label: 'tags', value: 'dictionary[string, string]', isDefaulted: true },
]

export enum DefaultPropertiesKeys {
  Account = '/ancestors.account.reported.name',
  Cloud = '/ancestors.cloud.reported.name',
  Region = '/ancestors.region.reported.name',
  Severity = '/security.severity',
  Tags = 'tags',
}
