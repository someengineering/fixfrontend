import { Trans } from '@lingui/macro'
import { MenuItem, Select, TextField } from '@mui/material'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { DurationPicker } from 'src/shared/duration-picker'
import { Predicate } from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryFormFilterRowStringValue } from './InventoryFormFilterRowStringValue'
import { AutoCompletePreDefinedItems, getAutoCompletePropsFromKey, getAutocompleteDataFromKey, getAutocompleteValueFromKey } from './utils'

interface InventoryFormFilterRowValuesProps {
  keyString: string
  data: Predicate
  preItems?: AutoCompletePreDefinedItems
  fqn: ResourceComplexKindSimpleTypeDefinitions | null
  onChange: (newTerm: Predicate) => void
}

export function InventoryFormFilterRowValues({ data, keyString, fqn, preItems, onChange }: InventoryFormFilterRowValuesProps) {
  const multiple = data.op === 'in' || data.op === 'not in'
  const handleChangeValue = (value: string | string[] | null) => {
    onChange(
      new Predicate({
        path: data.path,
        op: data.op,
        value:
          typeof value === 'string'
            ? value === 'null'
              ? null
              : value
            : value
              ? value.map((item) => (item === 'null' ? null : item))
              : value,
        args: data.args,
      }),
    )
  }
  const currentValue =
    (typeof data.value === 'string'
      ? multiple
        ? !data.value
          ? []
          : [data.value]
        : data.value
      : Array.isArray(data.value)
        ? multiple
          ? data.value.map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
          : typeof data.value[0] === 'string'
            ? data.value[0] || ''
            : JSON.stringify(data.value[0])
        : multiple
          ? data.value
            ? [JSON.stringify(data.value)]
            : []
          : data.value
            ? JSON.stringify(data.value)
            : '') || (multiple ? [] : 'null')

  let isDouble = false
  let isNumber = false
  switch (fqn) {
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
    case 'string': {
      const autocompleteData = preItems ? getAutocompleteDataFromKey(data.path.toString() || '', preItems) : []
      return (
        <InventoryFormFilterRowStringValue
          key={keyString}
          size="small"
          sx={{ minWidth: { xl: 250, lg: 190, xs: 200 }, maxWidth: '100%' }}
          isDouble={isDouble}
          isNumber={isNumber}
          multiple={multiple}
          networkDisabled={!!autocompleteData.length}
          onChange={(option) => handleChangeValue(Array.isArray(option) ? option.map((i) => i.value) : option?.value ?? null)}
          value={
            preItems
              ? getAutocompleteValueFromKey(data.path.toString() || '', preItems, currentValue, true)
              : Array.isArray(currentValue)
                ? currentValue?.map((value) => ({
                    label: value === 'null' ? 'NULL' : value,
                    value: value ?? 'null',
                  }))
                : { label: currentValue === 'null' ? 'NULL' : currentValue, value: currentValue } || null
          }
          defaultOptions={preItems ? getAutocompleteDataFromKey(data.path.toString() || '', preItems) : undefined}
          propertyName={data.path.toString() || ''}
          autoFocus={!currentValue.length}
          {...(preItems ? getAutoCompletePropsFromKey(data.path.toString() || '') : {})}
        />
      )
    }
    case 'boolean':
      return (
        <Select
          sx={{ minWidth: 100, height: 'fit-content' }}
          value={typeof currentValue === 'string' && ['null', 'true', 'false'].includes(currentValue) ? currentValue : ''}
          onChange={(e) => handleChangeValue(e.target.value)}
          size="small"
          autoFocus={!currentValue.length}
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
          defaultValue={dayjs(typeof currentValue === 'string' ? currentValue : undefined)}
          onChange={(val) => handleChangeValue(val?.toISOString() ?? null)}
        />
      )
    case 'date':
      return (
        <DatePicker
          label={<Trans>Date Picker</Trans>}
          defaultValue={dayjs(typeof currentValue === 'string' ? currentValue : undefined)}
          onChange={(val) => handleChangeValue(val?.toISOString() ?? null)}
        />
      )
    case 'duration':
      return <DurationPicker value={typeof currentValue === 'string' ? currentValue : ''} onChange={handleChangeValue} />
    default:
      return (
        <TextField
          size="small"
          value={currentValue ?? ''}
          onChange={(e) => handleChangeValue(e.target.value || null)}
          label={<Trans>Value</Trans>}
          autoFocus={!data.value}
        />
      )
  }
}
