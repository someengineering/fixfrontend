// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import {
  ButtonBase,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Popover,
  Skeleton,
  Stack,
  Typography,
  backdropClasses,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventoryPropertyPathCompleteFqnQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import {
  OPType,
  Path,
  Predicate,
  TermValue,
  booleanOPTypes,
  durationOpTypes,
  jsonElementToNumber,
  jsonElementToString,
  kindDurationTypes,
  kindNumberTypes,
  numberOpTypes,
  opTypes,
  stringOPTypes,
  termValueToString,
} from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { InventoryFormFilterRowValues } from './InventoryFormFilterRowValues'
import { AutoCompletePreDefinedItems } from './utils'

interface InventoryFormValueOpProps {
  op?: OPType
  defaultOp?: OPType
  onChange: (op: OPType) => void
  fqn: ResourceComplexKindSimpleTypeDefinitions
}

const InventoryFormValueOp = ({ onChange, op, defaultOp, fqn }: InventoryFormValueOpProps) => {
  const [open, setOpen] = useState<HTMLElement | null>(null)

  const currentOpTypes = useMemo(() => {
    const result: OPType[] = kindDurationTypes.includes(fqn as (typeof kindDurationTypes)[number])
      ? [...durationOpTypes]
      : kindNumberTypes.includes(fqn as (typeof kindNumberTypes)[number])
        ? [...numberOpTypes]
        : fqn === 'string'
          ? [...stringOPTypes]
          : fqn === 'any'
            ? [...opTypes]
            : [...booleanOPTypes]
    return result
  }, [fqn])

  const value =
    op && currentOpTypes.includes(op)
      ? op
      : currentOpTypes.includes(defaultOp as OPType)
        ? defaultOp ?? currentOpTypes[0]
        : currentOpTypes[0]

  useEffect(() => {
    if (value !== op && currentOpTypes.indexOf(value)) {
      onChange(value)
    }
  }, [op, currentOpTypes, onChange, value])

  return (
    <>
      <ButtonBase component={Stack} onClick={(e) => setOpen(e.currentTarget)} direction="row">
        <Typography fontWeight={700} fontSize={14}>
          {value}
        </Typography>
        {/* {open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />} */}
      </ButtonBase>
      <Popover
        open={!!open}
        anchorEl={open}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => setOpen(null)}
        sx={{
          [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
          maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
        }}
      >
        <List dense>
          {currentOpTypes.map((op, i) => (
            <ListItem disablePadding key={`${op}-${i}`}>
              <ListItemButton
                role={undefined}
                onClick={() => {
                  onChange(op)
                  setOpen(null)
                }}
                dense
                component={Stack}
                direction="row"
                justifyContent="space-between"
              >
                <Typography>{op.toUpperCase()}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  )
}

interface InventoryFormValueValueProps {
  id?: number
  term?: Predicate
  defaultOp?: OPType
  defaultPath: Path
  defaultValue?: TermValue
  defaultArgs?: Record<string, TermValue>
  onChange: (value?: Predicate) => void
  fqn: ResourceComplexKindSimpleTypeDefinitions | null | undefined
  preItems?: AutoCompletePreDefinedItems
}

const InventoryFormValueValue = ({
  id = Math.random(),
  term,
  defaultValue,
  defaultPath,
  defaultArgs,
  defaultOp,
  onChange,
  fqn,
  preItems,
}: InventoryFormValueValueProps) => {
  const [open, setOpen] = useState<HTMLElement | null>(null)
  const valueStr = term ? termValueToString(term, true) : undefined

  return (
    <>
      <ButtonBase component={Stack} onClick={(e) => setOpen(e.currentTarget)} direction="row" gap={0.5}>
        {valueStr !== undefined ? (
          typeof valueStr === 'string' ? (
            <Chip label={valueStr} color="primary" size="small" variant="outlined" />
          ) : !valueStr.length ? (
            <Typography color="common.black" variant="subtitle1" fontWeight={700} p={0} width="auto" component="span">
              []
            </Typography>
          ) : (
            <>
              {valueStr.slice(0, 2).map((item, i) => (
                <Chip key={i} label={item} color="primary" size="small" variant="outlined" />
              ))}
              {valueStr.length > 2 ? <Chip label={`+${valueStr.length - 2}`} color="primary" size="small" variant="filled" /> : null}
            </>
          )
        ) : null}
        {/* {open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />} */}
      </ButtonBase>
      <Popover
        open={!!open}
        anchorEl={open}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => setOpen(null)}
        sx={{
          [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
          maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
        }}
      >
        {fqn ? (
          <InventoryFormFilterRowValues
            fqn={fqn}
            keyString={`${fqn}_${id}`}
            data={
              term ??
              new Predicate({ op: defaultOp ?? 'in', path: defaultPath ?? new Path({}), value: defaultValue ?? null, args: defaultArgs })
            }
            inline
            onChange={onChange}
            preItems={preItems}
            onClose={() => setOpen(null)}
          />
        ) : (
          <Skeleton height={40} width={200} variant="rounded" />
        )}
      </Popover>
    </>
  )
}

interface InventoryFormValueProps {
  id?: number
  term?: Predicate
  defaultOp?: OPType
  defaultPath: Path
  defaultValue?: TermValue
  defaultArgs?: Record<string, TermValue>
  fqn?: ResourceComplexKindSimpleTypeDefinitions
  preItems?: AutoCompletePreDefinedItems
  onChange: (term: Predicate | undefined) => void
}

export const InventoryFormValue = ({
  id = 0,
  term,
  defaultOp = 'in',
  defaultPath,
  defaultValue = null,
  defaultArgs,
  fqn,
  preItems,
  onChange,
}: InventoryFormValueProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data: gotFqn = fqn ?? 'any' } = useQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query-fqn',
      selectedWorkspace?.id,
      ...(defaultPath?.getPathAndProp() ?? ['', '']),
    ] as const,
    queryFn: postWorkspaceInventoryPropertyPathCompleteFqnQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id && !fqn,
  })

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
      <Divider orientation="vertical" flexItem />
      <InventoryFormValueOp
        op={term?.op as OPType | undefined}
        fqn={gotFqn ?? 'any'}
        defaultOp={defaultOp}
        onChange={(op) => {
          const value = term?.value ?? defaultValue
          const valueStr =
            gotFqn === 'float' || gotFqn === 'int32' || gotFqn === 'int64' || gotFqn === 'double'
              ? jsonElementToNumber(value, true)
              : gotFqn === 'string'
                ? jsonElementToString(value, true)
                : gotFqn === 'boolean'
                  ? typeof value === 'boolean'
                    ? value
                    : value === 'null'
                      ? null
                      : value === 'true'
                  : value
          onChange(
            new Predicate({
              path: term?.path ?? defaultPath ?? new Path({}),
              op,
              value:
                value !== null
                  ? op === 'in' || op === 'not in'
                    ? !Array.isArray(value)
                      ? [value]
                      : Array.isArray(value)
                        ? value
                        : typeof valueStr === 'string' || typeof valueStr === 'number' || typeof valueStr === 'boolean'
                          ? valueStr === 'null'
                            ? []
                            : [valueStr]
                          : valueStr
                    : Array.isArray(value)
                      ? typeof value[0] === 'string' || typeof value[0] === 'number' || typeof value[0] === 'boolean'
                        ? value[0]
                        : jsonElementToString(value[0], false)
                      : value
                  : op === 'in' || op === 'not in'
                    ? []
                    : null,
              args: term?.args ?? defaultArgs,
            }),
          )
        }}
      />
      <Divider orientation="vertical" flexItem />
      <InventoryFormValueValue
        fqn={gotFqn}
        id={id}
        defaultPath={defaultPath}
        defaultArgs={defaultArgs}
        defaultOp={defaultOp}
        term={term}
        defaultValue={defaultValue}
        onChange={onChange}
        preItems={preItems}
      />
    </Stack>
  )
}
