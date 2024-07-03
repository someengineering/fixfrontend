import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

interface InventoryFormRegionValuesProps {
  open: HTMLDivElement | null
  onClose: () => void
  preItems: AutoCompletePreDefinedItems
  values?: string[]
}

export const InventoryFormRegionValues = ({ preItems, onClose, open, values }: InventoryFormRegionValuesProps) => {
  const { region, setCloudAccountRegion, deleteCloudAccountRegion, changeCloudAccountRegionFromIdToName } = useFixQueryParser()
  const isId = region?.path.parts.at(-1)?.name === 'id'
  let curValues = values ?? termValueToStringArray(region?.value)
  if (isId && preItems.regions.length) {
    curValues = curValues.map((value) => preItems.regions.find((i) => i.id === value)?.value).filter((i) => i) as string[]
    window.setTimeout(() => {
      changeCloudAccountRegionFromIdToName('region', curValues, 'in')
    })
  }
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
    valuesToAdd.forEach((value) => result.push({ label: value, value, id: value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.regions])
  return (
    <InventoryFormDefaultValue
      onChange={(values) => {
        if (isId) {
          deleteCloudAccountRegion('region')
        }
        if (values) {
          setCloudAccountRegion('region', 'in', values, true)
        } else {
          deleteCloudAccountRegion('region', true)
        }
      }}
      values={curValues}
      label={t`Region`}
      onClose={onClose}
      open={open}
      options={regionOptions}
    />
  )
}
