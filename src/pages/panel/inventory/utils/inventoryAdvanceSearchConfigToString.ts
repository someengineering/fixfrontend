import { OPType, stringSimpleTypes } from 'src/pages/panel/shared/constants'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { getArrayFromInOP } from './getArrayFromInOP'

export interface InventoryAdvanceSearchConfig {
  id: number
  property: string | null
  op: OPType | null
  value: string | null
  fqn: ResourceComplexKindSimpleTypeDefinitions | null
}

export const inventoryAdvanceSearchConfigToString = (config: InventoryAdvanceSearchConfig | string | null) => {
  if (typeof config === 'string' || !config) {
    return config
  }
  if (config.property && config.op && config.value && config.fqn) {
    const value =
      stringSimpleTypes.includes(config.fqn as (typeof stringSimpleTypes)[number]) && config.value !== 'null'
        ? config.op === 'in' || config.op === 'not in'
          ? JSON.stringify(getArrayFromInOP(config.value, true))
          : `"${config.value}"`
        : config.value
    return `${config.property} ${config.op} ${value}`
  }
  return null
}
