import { Trans } from '@lingui/macro'
import { Button, MenuItem, Popover, Select, Skeleton, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
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
import { AutoCompletePreDefinedItems, getOpTypeLabel } from './utils'

interface InventoryFormMorePopoverProps {
  id?: number
  open: HTMLElement | null
  defaultFqn?: ResourceComplexKindSimpleTypeDefinitions
  defaultValue?: Predicate
  preItems?: AutoCompletePreDefinedItems
  onChange: (term: Predicate | undefined) => void
  onFqnChange?: (fqn?: ResourceComplexKindSimpleTypeDefinitions | null) => void
  onClose: () => void
}

export const InventoryFormMorePopover = ({
  onChange,
  onClose,
  open,
  defaultFqn,
  defaultValue,
  preItems,
  id = 0,
}: InventoryFormMorePopoverProps) => {
  const { is } = useFixQueryParser()
  const [fqn, setFqn] = useState(defaultFqn)
  const [value, setValue] = useState(defaultValue)
  const onSubmit = () => {
    onChange(value)
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

  return (
    <Popover open={!!open} anchorEl={open} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} onClose={onSubmit}>
      <Stack
        pb={2}
        px={2}
        spacing={1}
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Stack direction="row" flexWrap="wrap" overflow="auto" pt={2}>
          <InventoryFormFilterRowProperty
            kinds={preItems?.kinds.map((i) => i.value) ?? []}
            selectedKinds={is()?.kinds ?? null}
            defaultValue={value?.path.toString()}
            onChange={({ fqn, op, property, value }) => {
              if (fqn && property) {
                setFqn(fqn)
                setValue(new Predicate({ path: Path.from_string(property), value: value || null, op: op || '=' }))
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
                      <Typography>{getOpTypeLabel(op)}</Typography>
                      <Typography>{op.toUpperCase()}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              {fqnType && value && value.path.toString() ? (
                <InventoryFormFilterRowValues
                  fqn={fqnType}
                  keyString={`${fqn}_${id}_${value.toString()}`}
                  data={value}
                  onChange={(newTerm) => {
                    setValue(newTerm)
                  }}
                  preItems={preItems}
                />
              ) : (
                <Skeleton>
                  <InventoryFormFilterRowValues
                    fqn="string"
                    keyString={`${fqn}_${id}_${value?.toString()}`}
                    data={value}
                    onChange={(newTerm) => {
                      setValue(newTerm)
                    }}
                    preItems={preItems}
                  />
                </Skeleton>
              )}
            </>
          ) : null}
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                onClose()
              }}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              color="warning"
              variant="outlined"
              onClick={() => {
                setValue(undefined)
              }}
            >
              <Trans>clear</Trans>
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button color="primary" variant="contained" type="submit">
              <Trans>Submit</Trans>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Popover>
  )
}
