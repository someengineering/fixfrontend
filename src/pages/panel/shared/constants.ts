export const booleanOPTypes = ['=', '!='] as const

export const stringOPTypes = ['in', ...booleanOPTypes, '~', '!~'] as const

export const opTypes = [...stringOPTypes, '>', '>=', '<', '<='] as const

export const kindNumberTypes = ['int32', 'int64', 'float', 'double', 'duration', 'datetime', 'date'] as const

export const kindSimpleTypes = ['any', 'boolean', 'string', ...kindNumberTypes] as const

export type OPType = (typeof opTypes)[number]

export const defaultProperties: { key: string; label: string; value: string; isDefaulted?: boolean }[] = [
  { key: 'Account', label: '/ancestors.account.reported.id', value: 'string', isDefaulted: true },
  { key: 'Region', label: '/ancestors.region.reported.id', value: 'string', isDefaulted: true },
  { key: 'Severity', label: '/security.severity', value: 'string', isDefaulted: true },
  { key: 'Cloud', label: '/ancestors.cloud.reported.id', value: 'string', isDefaulted: true },
  { key: 'Tags', label: 'tags', value: 'dictionary[string, string]', isDefaulted: true },
]

export enum DefaultPropertiesKeys {
  Account = '/ancestors.account.reported.id',
  Cloud = '/ancestors.cloud.reported.id',
  Regions = '/ancestors.region.reported.id',
  Severity = '/security.severity',
  Tags = 'tags',
}
