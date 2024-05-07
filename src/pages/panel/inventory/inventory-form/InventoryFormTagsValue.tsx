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

interface InventoryFormTagsValueProps {
  id?: number
  open: HTMLElement | null
  preItems?: AutoCompletePreDefinedItems
  defaultValue?: Predicate
  onChange: (term: Predicate | undefined) => void
  onClose: () => void
}

export const InventoryFormTagsValue = ({ onChange, onClose, open, defaultValue, preItems, id = 0 }: InventoryFormTagsValueProps) => {
  const { is } = useFixQueryParser()
  const [fqn, setFqn] = useState('dictionary[string, string]')
  const [value, setValue] = useState(defaultValue)
  const handleClose = () => {
    setFqn('dictionary[string, string]')
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

  return (
    <Popover
      open={!!open}
      anchorEl={open}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={handleClose}
      sx={{
        [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
        maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
      }}
    >
      <Stack pb={2} px={2} spacing={1}>
        <Stack direction="row" flexWrap="wrap" pt={2}>
          <InventoryFormFilterRowProperty
            kinds={preItems?.kinds.map((i) => i.value) ?? []}
            selectedKinds={is()?.kinds ?? null}
            defaultForcedValue="tags"
            onChange={({ fqn, op, property, value }) => {
              if (fqn && property) {
                setFqn(fqn)
                setValue(new Predicate({ path: Path.from_string(property), value: value === 'null' ? null : value ?? null, op: op || '=' }))
              } else {
                setFqn('dictionary[string, string]')
                setValue(defaultValue)
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
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              onChange(value)
              handleClose()
            }}
            startIcon={<EditIcon fontSize="small" />}
          >
            <Trans>Change</Trans>
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}
