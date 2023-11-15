import { ResourceComplexKindProperty } from 'src/shared/types/server'

export const booleanOPTypes = ['=', '!='] as const

export const stringOPTypes = ['in', ...booleanOPTypes, '~', '!~'] as const

export const opTypes = [...stringOPTypes, '>', '>=', '<', '<='] as const

export type OPType = (typeof opTypes)[number]

export const defaultKeys = {
  account: {
    kind: {
      type: 'simple',
      fqn: 'string',
    },
    required: false,
    description: null,
    metadata: null,
  } as ResourceComplexKindProperty,
  region: {
    kind: {
      type: 'simple',
      fqn: 'string',
    },
    required: false,
    description: null,
    metadata: null,
  } as ResourceComplexKindProperty,
  severity: {
    kind: {
      type: 'simple',
      fqn: 'string',
    },
    required: false,
    description: null,
    metadata: null,
  } as ResourceComplexKindProperty,
  cloud: {
    kind: {
      type: 'simple',
      fqn: 'string',
    },
    required: false,
    description: null,
    metadata: null,
  } as ResourceComplexKindProperty,
}
