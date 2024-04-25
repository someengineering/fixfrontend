import { Trans } from '@lingui/macro'
import { Button, MenuItem, Popover, Select, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventoryPropertyPathCompleteFqnQuery } from 'src/pages/panel/shared/queries'
import {
  OPType,
  Path,
  Predicate,
  TermValue,
  booleanOPTypes,
  durationOpTypes,
  kindDurationTypes,
  kindNumberTypes,
  numberOpTypes,
  stringOPTypes,
} from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryFormFilterRowValues } from './InventoryFormFilterRowValues'
import { AutoCompletePreDefinedItems, getOpTypeLabel } from './utils'

interface InventoryFormPopoverProps {
  id?: number
  open: HTMLElement | null
  term?: Predicate
  defaultOp?: OPType
  defaultPath: Path
  defaultValue?: TermValue
  defaultArgs?: Record<string, TermValue>
  fqn?: ResourceComplexKindSimpleTypeDefinitions
  preItems?: AutoCompletePreDefinedItems
  onChange: (term: Predicate | undefined) => void
  onFqnChange?: (fqn?: ResourceComplexKindSimpleTypeDefinitions | null) => void
  onClose: () => void
}

export const InventoryFormPopover = ({
  onChange,
  onClose,
  open,
  term,
  preItems,
  fqn,
  defaultPath,
  defaultValue = null,
  defaultArgs,
  defaultOp = '=',
  id = 0,
}: InventoryFormPopoverProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data: gotFqn = fqn } = useQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query-fqn',
      selectedWorkspace?.id,
      ...(defaultPath?.getPathAndProp() ?? ['', '']),
    ] as const,
    queryFn: postWorkspaceInventoryPropertyPathCompleteFqnQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id && !fqn,
  })
  const [value, setValue] = useState(term)
  useEffect(() => {
    setValue(term)
  }, [term])
  const onSubmit = () => {
    onChange(value)
    onClose()
  }

  const currentOpTypes = useMemo(
    () =>
      gotFqn
        ? kindDurationTypes.includes(gotFqn as (typeof kindDurationTypes)[number])
          ? durationOpTypes
          : kindNumberTypes.includes(gotFqn as (typeof kindNumberTypes)[number])
            ? numberOpTypes
            : gotFqn === 'string' || gotFqn === 'any'
              ? stringOPTypes
              : booleanOPTypes
        : [],
    [gotFqn],
  )

  return (
    <Popover open={!!open} anchorEl={open} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} onClose={onSubmit}>
      <Stack
        pb={1}
        px={1}
        spacing={1}
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Stack direction="row" flexWrap="wrap" overflow="auto" pt={1}>
          <Select
            size="small"
            value={
              value?.op && (currentOpTypes as string[]).includes(value.op)
                ? value.op
                : (currentOpTypes as string[]).includes(defaultOp)
                  ? defaultOp
                  : currentOpTypes[0]
            }
            onChange={(e) =>
              setValue(
                (prev) =>
                  new Predicate({
                    path: prev?.path ?? defaultPath ?? new Path({}),
                    op: e.target.value as OPType,
                    value: prev?.value ?? defaultValue,
                    args: prev?.args ?? defaultArgs,
                  }),
              )
            }
            autoFocus
            inputProps={{
              autoFocus: true,
            }}
            sx={{ mr: 1, mb: 1, height: 'fit-content' }}
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
          {gotFqn ? (
            <InventoryFormFilterRowValues
              fqn={gotFqn}
              keyString={`${gotFqn}_${id}_${value?.toString()}`}
              data={value ?? new Predicate({ op: defaultOp, path: defaultPath ?? new Path({}), value: defaultValue, args: defaultArgs })}
              onChange={(newTerm) => {
                setValue(newTerm)
              }}
              preItems={preItems}
            />
          ) : (
            <Skeleton>
              <InventoryFormFilterRowValues
                fqn="string"
                keyString={`${gotFqn}_${id}_${value?.toString()}`}
                data={value ?? new Predicate({ op: defaultOp, path: defaultPath ?? new Path({}), value: defaultValue, args: defaultArgs })}
                onChange={(newTerm) => {
                  setValue(newTerm)
                }}
                preItems={preItems}
              />
            </Skeleton>
          )}
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                setValue(term)
                onClose()
              }}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              color="warning"
              variant="outlined"
              onClick={() => {
                setValue(new Predicate({ op: defaultOp, value: defaultValue, path: defaultPath ?? new Path({}), args: defaultArgs }))
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
