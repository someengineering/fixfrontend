import { Trans } from '@lingui/macro'
import EditIcon from '@mui/icons-material/Edit'
import { Button, MenuItem, Popover, Select, Skeleton, Stack, Typography, backdropClasses } from '@mui/material'
import { useMemo, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import {
  Path,
  Predicate,
  arrayOpTypes,
  booleanOPTypes,
  durationOpTypes,
  kindDurationTypes,
  kindNumberTypes,
  numberOpTypes,
  stringOPTypes,
  useFixQueryParser,
} from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryFormFilterRowProperty } from './InventoryFormFilterRowProperty'
import { InventoryFormFilterRowValues } from './InventoryFormFilterRowValues'
import { AutoCompletePreDefinedItems } from './utils'

interface InventoryFormMoreValueProps {
  id?: number
  open: HTMLElement | null
  defaultFqn?: ResourceComplexKindSimpleTypeDefinitions
  defaultValue?: Predicate
  preItems?: AutoCompletePreDefinedItems
  onChange: (term: Predicate | undefined) => void
  onFqnChange?: (fqn?: ResourceComplexKindSimpleTypeDefinitions | null) => void
  onClose: () => void
}

export const InventoryFormMoreValue = ({
  onChange,
  onClose,
  open,
  defaultFqn,
  defaultValue,
  preItems,
  id = 0,
}: InventoryFormMoreValueProps) => {
  const { is } = useFixQueryParser()
  const [fqn, setFqn] = useState(defaultFqn)
  const [value, setValue] = useState(defaultValue)
  const handleSubmit = (_?: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'escapeKeyDown') {
      onChange(value)
    }
    setFqn(defaultFqn)
    setValue(defaultValue)
    onClose()
  }

  const realFqn = fqn?.split('[')
  const arrayOnly = (realFqn?.length ?? 0) > 1
  const fqnType = realFqn?.[0] as ResourceComplexKindSimpleTypeDefinitions | undefined

  const currentOpTypes = useMemo(
    () =>
      arrayOnly
        ? arrayOpTypes
        : fqnType
          ? kindDurationTypes.includes(fqnType as (typeof kindDurationTypes)[number])
            ? durationOpTypes
            : kindNumberTypes.includes(fqnType as (typeof kindNumberTypes)[number])
              ? numberOpTypes
              : fqnType === 'string' || fqnType === 'any'
                ? stringOPTypes
                : booleanOPTypes
          : [],
    [fqnType, arrayOnly],
  )

  const pathStr = value?.path.toString()

  return (
    <Popover
      open={!!open}
      anchorEl={open}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={handleSubmit}
      sx={{
        [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
        maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
      }}
    >
      <Stack
        pb={2}
        px={2}
        spacing={1}
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Stack direction="row" flexWrap="wrap" pt={2}>
          <InventoryFormFilterRowProperty
            kinds={preItems?.kinds.map((i) => i.value) ?? []}
            selectedKinds={is()?.kinds ?? null}
            defaultValue={pathStr?.startsWith('tags.') ? pathStr.split('.').slice(1).join('.') : pathStr}
            onChange={({ fqn, op, property, value }) => {
              if (fqn && property) {
                setFqn(fqn)
                setValue(new Predicate({ path: Path.from_string(property), value: value === 'null' ? null : value ?? null, op: op || '=' }))
              }
            }}
          />
          {value && value.path.toString() ? (
            <>
              <Select
                size="small"
                value={value?.op && (currentOpTypes as string[]).includes(value.op) ? value.op : currentOpTypes[0]}
                onChange={(e) =>
                  setValue(
                    (prev) =>
                      new Predicate({
                        path: prev?.path ?? new Path({}),
                        op: e.target.value,
                        value: prev?.value ?? '',
                      }),
                  )
                }
                autoFocus
                inputProps={{
                  autoFocus: true,
                }}
                sx={{ mx: 1, mb: 1, height: 'fit-content' }}
              >
                {currentOpTypes.map((op, i) => (
                  <MenuItem value={op} key={`${op}-${i}`}>
                    <Stack direction="row" justifyContent="space-between" width="100%" spacing={1}>
                      <Typography>{op.toUpperCase()}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              {fqnType && value && value.path.toString() ? (
                <InventoryFormFilterRowValues
                  fqn={fqnType}
                  keyString={`${fqn}_${id}_${value.path.toString()}`}
                  data={value}
                  onChange={setValue}
                  preItems={preItems}
                />
              ) : (
                <Skeleton>
                  <InventoryFormFilterRowValues
                    fqn="string"
                    keyString={`${fqn}_${id}_${value?.path?.toString()}`}
                    data={value}
                    onChange={() => {}}
                    preItems={preItems}
                  />
                </Skeleton>
              )}
            </>
          ) : null}
        </Stack>
        <Stack alignItems="end">
          <Button color="primary" variant="contained" type="submit" startIcon={<EditIcon fontSize="small" />}>
            <Trans>Change</Trans>
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}
