import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Autocomplete, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryModelQuery } from 'src/pages/panel/shared/queries'
import { ResourceComplexKindProperty } from 'src/shared/types/server'
import { InventoryAdvanceSearchConfig } from './InventoryAdvanceSearch'
import { InventoryFormFilterRowSkeleton } from './InventoryFormFilterRow.skeleton'
import {
  AutoCompletePreDefinedItems,
  AutoCompleteValue,
  OPType,
  booleanOPTypes,
  getArrayFromInOP,
  getAutoCompletePropsFromKey,
  getAutocompleteDataFromKey,
  getAutocompleteValueFromKey,
  opTypes,
  stringOPTypes,
} from './utils'
import { defaultKeys } from './utils/constants'
const numberTypes = ['int32', 'int64', 'float', 'double', 'duration', 'datetime', 'date']

interface InventoryFormFilterRowProps {
  item: InventoryAdvanceSearchConfig
  setConfig: Dispatch<SetStateAction<InventoryAdvanceSearchConfig[]>>
  index: number
  kind: string | null
  preItems: AutoCompletePreDefinedItems
}

export const InventoryFormFilterRow = ({ kind, item, setConfig, index, preItems }: InventoryFormFilterRowProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-inventory-model', selectedWorkspace?.id, kind || undefined],
    queryFn: getWorkspaceInventoryModelQuery,
    enabled: !!(kind && selectedWorkspace?.id),
  })
  const handleAdd = () => {
    setConfig((prev) => {
      const newConfig = [...prev]
      newConfig.splice(index + 1, 0, { id: Math.random(), key: null, op: null, value: null, kindProp: null })
      return newConfig
    })
  }
  const handleRemove = () => {
    setConfig((prev) => {
      const newConfig = [...prev]
      newConfig.splice(index, 1)
      if (!newConfig.length) {
        return [{ id: Math.random(), key: null, op: null, value: null, kindProp: null }]
      }
      return newConfig
    })
  }
  const handleChange = (params: {
    key?: string | null
    op?: OPType | null
    value?: string | null
    kindProp?: ResourceComplexKindProperty | null
  }) => {
    setConfig((prev) => {
      const newConfig = [...prev]
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
  }
  const processedData = useMemo(
    () => Object.entries({ ...defaultKeys, ...(kind && data ? data : {}) }).map(([label, value]) => ({ label, value })),
    [kind, data],
  )
  const processedValue = useMemo(() => processedData.find((kind) => kind.label === item.key) ?? null, [processedData, item.key])
  const currentOpTypes = useMemo(
    () =>
      item.key && item.kindProp && item.kindProp.kind.type === 'simple'
        ? numberTypes.includes(item.kindProp.kind.fqn)
          ? opTypes
          : item.kindProp.kind.fqn === 'string'
          ? stringOPTypes
          : booleanOPTypes
        : null,
    [item.key, item.kindProp],
  )
  const currentValue = item.value?.[0] === '[' ? getArrayFromInOP(item.value) : item.value
  return isLoading ? (
    <InventoryFormFilterRowSkeleton />
  ) : (
    <Stack direction="row" spacing={1}>
      <Autocomplete
        size="small"
        disablePortal
        sx={{ minWidth: 250 }}
        value={processedValue}
        onChange={(_, option) =>
          !option
            ? handleChange({ key: null, kindProp: null, op: null, value: null })
            : handleChange({
                key: option.label,
                kindProp: option.value,
                op: null,
                value: null,
              })
        }
        options={processedData}
        renderInput={(params) => <TextField {...params} label={<Trans>Key</Trans>} />}
      />
      {currentOpTypes ? (
        <>
          <Select
            size="small"
            value={item.op && (currentOpTypes as readonly string[]).includes(item.op) ? item.op : ''}
            onChange={(e) => handleChange({ op: e.target.value as OPType })}
            autoFocus
          >
            {currentOpTypes.map((op, i) => (
              <MenuItem value={op} key={`${op}-${i}`}>
                {op}
              </MenuItem>
            ))}
          </Select>
          {item.kindProp?.kind.type === 'simple' && item.key ? (
            Object.keys(defaultKeys).includes(item.key ?? '') ? (
              <Autocomplete
                size="small"
                sx={{ minWidth: 250 }}
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
                options={getAutocompleteDataFromKey(item.key, preItems)}
                {...getAutoCompletePropsFromKey(item.key)}
                value={getAutocompleteValueFromKey(item.key, preItems, item?.value, item.op === 'in') as AutoCompleteValue[]}
                multiple={item.op === 'in'}
                limitTags={1}
              />
            ) : item.kindProp.kind.fqn === 'boolean' ? (
              <Select value={item.value} onChange={(e) => handleChange({ value: e.target.value })} size="small">
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
              />
            ) : (
              <TextField
                size="small"
                value={currentValue ?? ''}
                onChange={(e) => handleChange({ value: e.target.value || null })}
                label={<Trans>Value</Trans>}
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
  ) // ) : !kind || !item.key || defaultKeys.includes(item.key) ? (
  //   <Stack direction="row" spacing={1}>
  //     <Autocomplete
  //       disablePortal
  //       sx={{ minWidth: 250 }}
  //       value={item.key}
  //       onChange={(_, key) => handleChange({ key, newType: 'simple', newFqn: 'string', op: null, value: null })}
  //       getOptionLabel={(option) => option ?? ''}
  //       options={defaultKeys}
  //       renderInput={(params) => <TextField {...params} label={<Trans>Key</Trans>} />}
  //     />
  //     {item.key ? (
  //       <Autocomplete
  //         disablePortal
  //         value={item.op && (stringOPTypes as readonly string[]).includes(item.op) ? item.op : null}
  //         onChange={(_, op) => handleChange({ op })}
  //         getOptionLabel={(option) => option ?? ''}
  //         options={stringOPTypes}
  //         renderInput={(params) => <TextField {...params} label={<Trans>Operator</Trans>} />}
  //       />
  //     ) : null}
  //     {item.key && item.op ? (
  //       <Autocomplete
  //         sx={{ minWidth: 250 }}
  //         onChange={(_, option) =>
  //           handleChange({
  //             value:
  //               typeof option === 'string' ? option : Array.isArray(option) ? `[${option.map((i) => i.value).join(',')}]` : option?.value,
  //           })
  //         }
  //         options={getAutocompleteDataFromKey(item.key, preItems)}
  //         {...getAutoCompletePropsFromKey(item.key)}
  //         value={getAutocompleteValueFromKey(item.key, preItems, item?.value, item.op === 'in') as AutoCompleteValue[]}
  //         multiple={item.op === 'in'}
  //       />
  //     ) : null}
  //   </Stack>
}
