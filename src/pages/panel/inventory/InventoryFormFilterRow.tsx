import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, MenuItem, Select, Stack } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import {
  OPType,
  booleanOPTypes,
  defaultProperties,
  durationOpTypes,
  kindDurationTypes,
  kindNumberTypes,
  numberOpTypes,
  stringOPTypes,
} from 'src/pages/panel/shared/constants'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryAdvanceSearchConfig } from './InventoryAdvanceSearch'
import { InventoryFormFilterRowProperty } from './InventoryFormFilterRowProperty'
import { InventoryFormFilterRowValues } from './InventoryFormFilterRowValues'
import { AutoCompletePreDefinedItems, getArrayFromInOP } from './utils'

interface InventoryFormFilterRowProps {
  item: InventoryAdvanceSearchConfig
  setConfig: Dispatch<SetStateAction<InventoryAdvanceSearchConfig[]>>
  showDelete: boolean
  id: number
  kind: string | null
  setKind: (kind: string | null) => void
  preItems: AutoCompletePreDefinedItems
  searchCrit: string
}

export const InventoryFormFilterRow = ({
  kind,
  setKind,
  showDelete,
  item,
  setConfig,
  id,
  preItems,
  searchCrit,
}: InventoryFormFilterRowProps) => {
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
      if (prev.length <= 1 && !prev[0]?.property) {
        setKind(null)
        return prev
      }
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
  }, [id, setConfig, setKind])

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
          if ((newConfig[index].op === 'in' || newConfig[index].op === 'not in') && !newConfig[index].value?.startsWith('[')) {
            newConfig[index].value = `[${newConfig[index].value ?? ''}]`
          } else if (
            newConfig[index].value?.startsWith('[') &&
            (newConfig[index].op ?? 'in') !== 'in' &&
            (newConfig[index].op ?? 'not in') !== 'not in'
          ) {
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
        ? kindDurationTypes.includes(item.fqn as (typeof kindDurationTypes)[number])
          ? durationOpTypes
          : kindNumberTypes.includes(item.fqn as (typeof kindNumberTypes)[number])
            ? numberOpTypes
            : item.fqn === 'string' || item.fqn === 'any'
              ? stringOPTypes
              : booleanOPTypes
        : null,
    [item.property, item.fqn],
  )

  const kinds = useMemo(() => preItems.kinds.map((i) => i.value), [preItems.kinds])

  return (
    <Stack direction="row" spacing={1}>
      <InventoryFormFilterRowProperty defaultValue={item.property} onChange={handleChange} selectedKind={kind} kinds={kinds} />
      {currentOpTypes ? (
        <>
          <Select
            size="small"
            value={item.op && (currentOpTypes as readonly string[]).includes(item.op) ? item.op : ''}
            onChange={(e) => handleChange({ op: e.target.value as OPType })}
            autoFocus
            inputProps={{
              autoFocus: true,
            }}
          >
            {currentOpTypes.map((op, i) => (
              <MenuItem value={op} key={`${op}-${i}`}>
                {op}
              </MenuItem>
            ))}
          </Select>
          {item.op && item.property ? (
            <InventoryFormFilterRowValues
              hasDefaultProperties={!!defaultProperties.find((i) => i.label === item.property)}
              data={item}
              onChange={handleChange}
              preItems={preItems}
              searchCrit={searchCrit}
            />
          ) : null}
        </>
      ) : null}
      <Stack direction="row" alignSelf="start" justifyContent="end" spacing={1}>
        <IconButton onClick={handleAdd}>
          <AddIcon color="success" />
        </IconButton>
        {showDelete || item.property ? (
          <IconButton onClick={handleRemove}>
            <DeleteIcon color="error" />
          </IconButton>
        ) : null}
      </Stack>
    </Stack>
  )
}
