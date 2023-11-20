import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Autocomplete, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { OPType, booleanOPTypes, defaultProperties, kindNumberTypes, opTypes, stringOPTypes } from 'src/pages/panel/shared/constants'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryAdvanceSearchConfig } from './InventoryAdvanceSearch'
import { InventoryFormFilterRowProperty } from './InventoryFormFilterRowProperty'
import {
  AutoCompletePreDefinedItems,
  AutoCompleteValue,
  getArrayFromInOP,
  getAutoCompletePropsFromKey,
  getAutocompleteDataFromKey,
  getAutocompleteValueFromKey,
} from './utils'

interface InventoryFormFilterRowProps {
  item: InventoryAdvanceSearchConfig
  setConfig: Dispatch<SetStateAction<InventoryAdvanceSearchConfig[]>>
  id: number
  kind: string | null
  preItems: AutoCompletePreDefinedItems
}

export const InventoryFormFilterRow = ({ kind, item, setConfig, id, preItems }: InventoryFormFilterRowProps) => {
  const handleAdd = useCallback(() => {
    setConfig((prev) => {
      const newConfig = [...prev]
      const index = newConfig.findIndex((i) => i.id === id)
      if (index >= 0) {
        newConfig.splice(index + 1, 0, { id: Math.random(), property: null, op: null, value: null, fqn: null })
      }
      return newConfig
    })
  }, [id, setConfig])

  const handleRemove = useCallback(() => {
    setConfig((prev) => {
      const newConfig = [...prev]
      const index = newConfig.findIndex((i) => i.id === id)
      if (index >= 0) {
        newConfig.splice(index, 1)
        if (!newConfig.length) {
          return [{ id: Math.random(), property: null, op: null, value: null, fqn: null }]
        }
      }
      return newConfig
    })
  }, [id, setConfig])

  const handleChange = useCallback(
    (params: {
      property?: string | null
      op?: OPType | null
      value?: string | null
      fqn?: ResourceComplexKindSimpleTypeDefinitions | null
    }) => {
      setConfig((prev) => {
        const newConfig = [...prev]
        const index = newConfig.findIndex((i) => i.id === id)
        newConfig[index] = {
          ...newConfig[index],
          ...params,
        }
        if (newConfig[index].value) {
          if (newConfig[index].op === 'in' && !newConfig[index].value?.startsWith('[')) {
            newConfig[index].value = `[${newConfig[index].value ?? ''}]`
          } else if (newConfig[index].value?.startsWith('[') && (newConfig[index].op ?? 'in') !== 'in') {
            newConfig[index].value = getArrayFromInOP(newConfig[index].value as string)[0]
          }
        }
        return newConfig
      })
    },
    [id, setConfig],
  )

  const currentOpTypes = useMemo(
    () =>
      item.property && item.fqn
        ? kindNumberTypes.includes(item.fqn as (typeof kindNumberTypes)[number])
          ? opTypes
          : item.fqn === 'string'
            ? stringOPTypes
            : booleanOPTypes
        : null,
    [item.property, item.fqn],
  )

  const kinds = useMemo(() => preItems.kinds.map((i) => i.value), [preItems.kinds])

  const currentValue = item.value?.[0] === '[' ? getArrayFromInOP(item.value) : item.value

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      <InventoryFormFilterRowProperty defaultValue={item.property} onChange={handleChange} selectedKind={kind} kinds={kinds} />
      {currentOpTypes ? (
        <>
          <Select
            size="small"
            value={item.op && (currentOpTypes as readonly string[]).includes(item.op) ? item.op : ''}
            onChange={(e) => handleChange({ op: e.target.value as OPType })}
            autoFocus={!item.op}
            inputProps={{
              autoFocus: !item.op,
            }}
          >
            {currentOpTypes.map((op, i) => (
              <MenuItem value={op} key={`${op}-${i}`}>
                {op}
              </MenuItem>
            ))}
          </Select>
          {item.op && item.property ? (
            defaultProperties.find((i) => i.label === item.property) ? (
              <Autocomplete
                size="small"
                sx={{ width: 250, maxWidth: '100%' }}
                onChange={(_, option) =>
                  handleChange({
                    value:
                      typeof option === 'string'
                        ? option
                        : Array.isArray(option)
                          ? option.length
                            ? `[${option.map((i) => i.value).join(',')}]`
                            : null
                          : option?.value ?? null,
                  })
                }
                options={getAutocompleteDataFromKey(item.property, preItems)}
                {...getAutoCompletePropsFromKey(item.property)}
                value={getAutocompleteValueFromKey(item.property, preItems, item?.value, item.op === 'in') as AutoCompleteValue[]}
                multiple={item.op === 'in'}
                autoFocus={!item.value}
                limitTags={1}
              />
            ) : item.fqn === 'boolean' ? (
              <Select
                sx={{ minWidth: 100 }}
                value={item.value || ''}
                onChange={(e) => handleChange({ value: e.target.value })}
                size="small"
                autoFocus={!item.value}
              >
                <MenuItem value="true">
                  <Trans>True</Trans>
                </MenuItem>
                <MenuItem value="false">
                  <Trans>False</Trans>
                </MenuItem>
              </Select>
            ) : item.op === 'in' ? (
              <Autocomplete
                size="small"
                freeSolo
                limitTags={1}
                handleHomeEndKeys
                sx={{ minWidth: 250 }}
                multiple
                options={(currentValue ?? []) as string[]}
                getOptionLabel={(option) => option}
                value={(currentValue ?? []) as string[]}
                onChange={(_, option) => handleChange({ value: option.length ? `[${option.join(',')}]` : null })}
                renderInput={(params) => <TextField {...params} label={<Trans>Value</Trans>} />}
                autoFocus={!item.value}
              />
            ) : (
              <TextField
                size="small"
                value={currentValue ?? ''}
                onChange={(e) => handleChange({ value: e.target.value || null })}
                label={<Trans>Value</Trans>}
                autoFocus={!item.value}
              />
            )
          ) : null}
        </>
      ) : null}
      <Stack direction="row" alignSelf="center" justifyContent="end" spacing={1}>
        <IconButton onClick={handleAdd}>
          <AddIcon color="success" />
        </IconButton>
        <IconButton onClick={handleRemove}>
          <DeleteIcon color="error" />
        </IconButton>
      </Stack>
    </Stack>
  )
}
