import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { DefaultPropertiesKeys, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

interface InventoryFormRegionValuesProps {
  open: HTMLDivElement | null
  onClose: () => void
  preItems: AutoCompletePreDefinedItems
  values?: string[]
  withAddButton?: boolean
}

export const InventoryFormRegionValues = ({ preItems, onClose, open, values, withAddButton }: InventoryFormRegionValuesProps) => {
  const { region, setPredicate, deletePredicate } = useFixQueryParser()
  const curValues = values ?? termValueToStringArray(region?.value)
  const regionOptions = useMemo(() => {
    const valuesToAdd = [...curValues]
    const result = [...preItems.regions]
    for (const region of preItems.regions) {
      let index = valuesToAdd.indexOf(region.value)
      if (index === -1) {
        index = valuesToAdd.indexOf(region.label)
      }
      if (index > -1) {
        valuesToAdd.splice(index, 1)
      }
    }
    valuesToAdd.forEach((value) => result.push({ label: value, value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.regions])
  return (
    <InventoryFormDefaultValue
      onChange={(values) =>
        values.length ? setPredicate(DefaultPropertiesKeys.Region, 'in', values) : deletePredicate(DefaultPropertiesKeys.Region)
      }
      values={curValues}
      label={t`Region`}
      onClose={onClose}
      open={open}
      options={regionOptions}
      withAddButton={withAddButton}
    />
  )
}
