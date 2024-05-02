import { Trans } from '@lingui/macro'
import { TextField } from '@mui/material'
import { DurationPicker } from 'src/shared/duration-picker'
import { Predicate } from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import {
  BooleanValues,
  InventoryFormFilterRowBooleanValue,
  InventoryFormFilterRowBooleanWithFieldValue,
} from './InventoryFormFilterRowBooleanValue'
import { InventoryFormFilterRowDateTimeValue } from './InventoryFormFilterRowDateTimeValue'
import { InventoryFormFilterRowDateValue } from './InventoryFormFilterRowDateValue'
import { InventoryFormFilterRowStringValue } from './InventoryFormFilterRowStringValue'
import { AutoCompletePreDefinedItems, getAutoCompletePropsFromKey, getAutocompleteDataFromKey, getAutocompleteValueFromKey } from './utils'

interface InventoryFormFilterRowValuesProps {
  keyString: string
  data: Predicate
  preItems?: AutoCompletePreDefinedItems
  fqn: ResourceComplexKindSimpleTypeDefinitions | null
  inline?: boolean
  onChange: (newTerm: Predicate | undefined) => void
  onClose?: () => void
}

const strToNumber = (value: string) => {
  const num = Number(value)
  if (Number.isNaN(num)) {
    return null
  }
  return num
}

export function InventoryFormFilterRowValues({
  keyString,
  data,
  preItems,
  fqn,
  inline,
  onChange,
  onClose,
}: InventoryFormFilterRowValuesProps) {
  const multiple = data.op === 'in' || data.op === 'not in'
  const handleChangeValue = (value: string | string[] | null | undefined) => {
    onChange(
      value === undefined || value === ''
        ? undefined
        : new Predicate({
            path: data.path,
            op: data.op,
            value:
              fqn === 'float' || fqn === 'int32' || fqn === 'int64' || fqn === 'double'
                ? typeof value === 'string'
                  ? strToNumber(value)
                  : value
                    ? value.map(strToNumber)
                    : null
                : fqn === 'boolean'
                  ? typeof value === 'string'
                    ? value.toLowerCase() === 'null'
                      ? null
                      : value.toLowerCase() === 'true'
                    : value
                      ? value.map((item) => (item.toLowerCase() === 'null' ? null : item.toLowerCase() === 'true'))
                      : null
                  : fqn === 'date' || fqn === 'datetime'
                    ? typeof value === 'string'
                      ? value === 'null'
                        ? null
                        : new Date(value).toISOString()
                      : value
                        ? value.map((item) => (item === 'null' ? null : new Date(item).toISOString()))
                        : null
                    : typeof value === 'string'
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
          : data.value !== undefined
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
          onClose={onClose}
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
    case 'boolean': {
      const Comp = inline ? InventoryFormFilterRowBooleanValue : InventoryFormFilterRowBooleanWithFieldValue
      return (
        <Comp
          onChange={handleChangeValue}
          onClose={onClose}
          value={
            typeof currentValue === 'string' && ['null', 'true', 'false'].includes(currentValue as BooleanValues)
              ? (currentValue as BooleanValues)
              : typeof currentValue === 'boolean'
                ? currentValue
                : undefined
          }
        />
      )
    }
    case 'datetime':
      return <InventoryFormFilterRowDateTimeValue value={currentValue} onChange={handleChangeValue} onClose={onClose} />
    case 'date':
      return <InventoryFormFilterRowDateValue value={currentValue} onChange={handleChangeValue} onClose={onClose} />
    case 'duration':
      return <DurationPicker value={typeof currentValue === 'string' ? currentValue : ''} onChange={handleChangeValue} onClose={onClose} />
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
