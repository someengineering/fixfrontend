import { t } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { DefaultPropertiesKeys, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

interface InventoryFormCloudValuesProps {
  open: HTMLDivElement | null
  onClose: () => void
  preItems: AutoCompletePreDefinedItems
  values?: string[]
  withAddButton?: boolean
}

export const InventoryFormCloudValues = ({ preItems, onClose, open, values, withAddButton }: InventoryFormCloudValuesProps) => {
  const {
    cloud,
    update: {
      current: { setPredicate, deletePredicate },
    },
  } = useFixQueryParser()
  const curValues = values ?? termValueToStringArray(cloud?.value)
  const cloudOptions = useMemo(() => {
    const valuesToAdd = [...curValues]
    const result = [...preItems.clouds]
    for (const cloud of preItems.clouds) {
      let index = valuesToAdd.indexOf(cloud.value)
      if (index === -1) {
        index = valuesToAdd.indexOf(cloud.label)
      }
      if (index > -1) {
        valuesToAdd.splice(index, 1)
      }
    }
    valuesToAdd.forEach((value) => result.push({ label: value, value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.clouds])
  return (
    <InventoryFormDefaultValue
      onChange={(values) =>
        values.length ? setPredicate(DefaultPropertiesKeys.Cloud, 'in', values) : deletePredicate(DefaultPropertiesKeys.Cloud)
      }
      values={curValues}
      label={t`Cloud`}
      onClose={onClose}
      open={open}
      options={cloudOptions}
      showItemLabel={(item) => (
        <Stack spacing={1} direction="row" alignItems="center">
          <Stack height={30}>
            <CloudAvatar cloud={item.value} small />
          </Stack>
          <Typography>{item.label}</Typography>
        </Stack>
      )}
      withAddButton={withAddButton}
    />
  )
}
