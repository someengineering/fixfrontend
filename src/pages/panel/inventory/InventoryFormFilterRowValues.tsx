import { Trans } from '@lingui/macro'
import { MenuItem, Select, TextField } from '@mui/material'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { OPType } from 'src/pages/panel/shared/constants'
import { DurationPicker } from 'src/shared/duration-picker'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryAdvanceSearchConfig } from './InventoryAdvanceSearch'
import { InventoryFormFilterRowStringValue } from './InventoryFormFilterRowStringValue'
import {
  AutoCompletePreDefinedItems,
  getArrayFromInOP,
  getAutoCompletePropsFromKey,
  getAutocompleteDataFromKey,
  getAutocompleteValueFromKey,
} from './utils'

interface InventoryFormFilterRowValuesProps<HasDefaultProperties extends boolean> {
  data: InventoryAdvanceSearchConfig
  preItems: AutoCompletePreDefinedItems
  hasDefaultProperties: HasDefaultProperties
  onChange: (params: {
    property?: string | null
    op?: OPType | null
    value?: string | null
    fqn?: ResourceComplexKindSimpleTypeDefinitions | null
  }) => void
  searchCrit: string
}

export function InventoryFormFilterRowValues<HasDefaultProperties extends boolean>({
  data,
  hasDefaultProperties,
  preItems,
  onChange,
  searchCrit,
}: InventoryFormFilterRowValuesProps<HasDefaultProperties>) {
  const multiple = data.op === 'in' || data.op === 'not in'
  const currentValue = (data.value?.[0] === '[' ? getArrayFromInOP(data.value) : data.value) || (multiple ? ([] as string[]) : null)

  let isDouble = false
  let isNumber = false
  switch (data.fqn) {
    case 'double':
    // @ts-expect-error falls through
    case 'float':
      isDouble = true
    // falls through
    case 'int32':
    // @ts-expect-error falls through
    case 'int64':
      isNumber = true
    // falls through
    case 'any':
    case 'string':
      return (
        <InventoryFormFilterRowStringValue
          size="small"
          sx={{ minWidth: 250, maxWidth: '100%' }}
          isDouble={isDouble}
          isNumber={isNumber}
          multiple={multiple}
          networkDisabled={hasDefaultProperties}
          onChange={(option) =>
            onChange({
              value: Array.isArray(option) ? (option.length ? `[${option.map((i) => i.value).join(',')}]` : null) : option?.value ?? null,
            })
          }
          value={
            (hasDefaultProperties
              ? getAutocompleteValueFromKey(data.property || '', preItems, data?.value, data.op === 'in' || data.op === 'not in', true)
              : typeof currentValue === 'string'
                ? { label: currentValue, value: currentValue }
                : currentValue?.map((value) => ({ label: value, value }))) || null
          }
          defaultOptions={hasDefaultProperties ? getAutocompleteDataFromKey(data.property || '', preItems) : undefined}
          searchCrit={searchCrit}
          propertyName={data.property || ''}
          autoFocus={!data.value}
          {...(hasDefaultProperties ? getAutoCompletePropsFromKey(data.property || '') : {})}
        />
      )
    case 'boolean':
      return (
        <Select
          sx={{ minWidth: 100 }}
          value={data.value || ''}
          onChange={(e) => onChange({ value: e.target.value })}
          size="small"
          autoFocus={!data.value}
        >
          <MenuItem value="null">
            <Trans>Null</Trans>
          </MenuItem>
          <MenuItem value="true">
            <Trans>True</Trans>
          </MenuItem>
          <MenuItem value="false">
            <Trans>False</Trans>
          </MenuItem>
        </Select>
      )
    case 'datetime':
      return (
        <DateTimePicker
          slotProps={{ textField: { size: 'small' } }}
          label={<Trans>Date Time Picker</Trans>}
          defaultValue={dayjs(data.value)}
          onChange={(val) => onChange({ value: val?.toISOString() ?? null })}
        />
      )
    case 'date':
      return (
        <DatePicker
          label={<Trans>Date Picker</Trans>}
          defaultValue={dayjs(data.value)}
          onChange={(val) => onChange({ value: val?.toISOString() ?? null })}
        />
      )
    case 'duration':
      return <DurationPicker value={data.value || ''} onChange={(value) => onChange({ value })} />
    default:
      return (
        <TextField
          size="small"
          value={currentValue ?? ''}
          onChange={(e) => onChange({ value: e.target.value || null })}
          label={<Trans>Value</Trans>}
          autoFocus={!data.value}
        />
      )
  }
}
