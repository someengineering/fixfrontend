import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownCircleOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Collapse, Divider, IconButton, TextField, styled } from '@mui/material'
import { ChangeEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { OPType } from 'src/pages/panel/shared/constants'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { InventoryForm } from './InventoryForm'
import { InventoryFormsSkeleton } from './InventoryForms.skeleton'
import { getArrayFromInOP } from './utils'

export interface InventoryAdvanceSearchConfig {
  id: number
  property: string | null
  op: OPType | null
  value: string | null
  fqn: ResourceComplexKindSimpleTypeDefinitions | null
}

interface InventoryAdvanceSearchProps {
  value: string
  onChange: (value: string) => void
}

const StyledArrowDropDownIcon = styled(ArrowDropDownIcon, { shouldForwardProp: shouldForwardProp })<{ showAdvanceSearch: boolean }>(
  ({ theme, showAdvanceSearch }) => ({
    transform: `rotate(${showAdvanceSearch ? '180' : '0'}deg)`,
    transformOrigin: 'center',
    transition: theme.transitions.create('transform'),
  }),
)

export const InventoryAdvanceSearch = ({ value: searchCrit, onChange }: InventoryAdvanceSearchProps) => {
  const [searchCritValue, setSearchCritValue] = useState('')
  const [config, setConfig] = useState<InventoryAdvanceSearchConfig[]>([
    { id: Math.random(), property: null, op: null, value: null, fqn: null },
  ])
  const [kind, setKind] = useState<string | null>(null)
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false)

  const timeoutRef = useRef<number>()

  const handleChangeValue = useCallback(
    (value: string) => {
      setSearchCritValue(value === 'all' || !value ? '' : value)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        onChange(value || 'all')
        timeoutRef.current = undefined
      }, panelUI.inputChangeDebounce)
    },
    [onChange],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChangeValue(e.target.value)
    },
    [handleChangeValue],
  )

  useEffect(() => {
    setConfig([{ id: Math.random(), property: null, op: null, value: null, fqn: null }])
  }, [kind])

  useEffect(() => {
    const configJoined = config
      .map((item) => {
        if (typeof item === 'string' || !item) {
          return item
        }
        if (item.property && item.op && item.value && item.fqn) {
          const value =
            item.fqn === 'string' ? (item.op === 'in' ? JSON.stringify(getArrayFromInOP(item.value)) : `'${item.value}'`) : item.value
          return `${item.property} ${item.op} ${value}`
        }
        return null
      })
      .filter((filter) => filter)
      .join(' and ')
    const result = (kind ? `is(${kind})${configJoined ? ' and ' : ''}` : '') + configJoined
    handleChangeValue(result || 'all')
  }, [config, handleChangeValue, kind])

  return (
    <>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Suspense fallback={<InventoryFormsSkeleton />}>
          <InventoryForm config={config} setConfig={setConfig} searchCrit={searchCrit} kind={kind} setKind={setKind} />
        </Suspense>
      </NetworkErrorBoundary>
      <Collapse in={showAdvanceSearch}>
        <TextField
          margin="dense"
          placeholder="all"
          fullWidth
          size="small"
          inputProps={{
            sx: {
              ml: 1,
            },
          }}
          value={searchCritValue}
          onChange={handleChange}
          InputProps={{ startAdornment: <SearchIcon /> }}
        />
      </Collapse>
      <Box my={2}>
        <Divider>
          <IconButton onClick={() => setShowAdvanceSearch((prev) => !prev)}>
            <StyledArrowDropDownIcon showAdvanceSearch={showAdvanceSearch} />
          </IconButton>
        </Divider>
      </Box>
    </>
  )
}
