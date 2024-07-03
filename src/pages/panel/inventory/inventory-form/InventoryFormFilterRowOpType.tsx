import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import {
  arrayOpTypes,
  booleanOPTypes,
  durationOpTypes,
  kindDurationTypes,
  kindNumberTypes,
  numberOpTypes,
  stringOPTypes,
} from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server-shared'

interface InventoryFormFilterRowOpTypeProps {
  op?: string
  fqn?: ResourceComplexKindSimpleTypeDefinitions | undefined
  arrayOnly: boolean
  onChange: (op: string) => void
}

export const InventoryFormFilterRowOpType = ({ op, onChange, arrayOnly, fqn }: InventoryFormFilterRowOpTypeProps) => {
  const currentOpTypes = useMemo(
    () =>
      arrayOnly
        ? arrayOpTypes
        : fqn
          ? kindDurationTypes.includes(fqn as (typeof kindDurationTypes)[number])
            ? durationOpTypes
            : kindNumberTypes.includes(fqn as (typeof kindNumberTypes)[number])
              ? numberOpTypes
              : fqn === 'string' || fqn === 'any'
                ? stringOPTypes
                : booleanOPTypes
          : [],
    [fqn, arrayOnly],
  )

  return (
    <Select
      size="small"
      value={!op ? currentOpTypes[0] : op}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mx: 1, mb: 1, height: 'fit-content' }}
    >
      {!op || (currentOpTypes as string[]).includes(op) ? null : (
        <MenuItem value={op} key={`${op}-unknown`}>
          <Stack direction="row" justifyContent="space-between" width="100%" spacing={1}>
            <Typography>{op.toUpperCase()}</Typography>
          </Stack>
        </MenuItem>
      )}
      {currentOpTypes.map((opItem, i) => (
        <MenuItem value={opItem} key={`${opItem}-${i}`}>
          <Stack direction="row" justifyContent="space-between" width="100%" spacing={1}>
            <Typography>{opItem.toUpperCase()}</Typography>
          </Stack>
        </MenuItem>
      ))}
    </Select>
  )
}
