import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownCircleOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Collapse, Divider, IconButton, TextField, styled } from '@mui/material'
import { ChangeEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { ResourceComplexKindProperty } from 'src/shared/types/server'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { InventoryForm } from './InventoryForm'
import { InventoryFormsSkeleton } from './InventoryForms.skeleton'
import { OPType } from './utils'

export interface InventoryAdvanceSearchConfig {
  id: number
  key: string | null
  op: OPType | null
  value: string | null
  kindProp: ResourceComplexKindProperty | null
}

interface InventoryAdvanceSearchProps {
  value: string
  onChange: (value: string) => void
}

const StyledArrowDropDownIcon = styled(ArrowDropDownIcon, { shouldForwardProp: shouldForwardProp })<{ showSimpleSearch: boolean }>(
  ({ theme, showSimpleSearch }) => ({
    transform: `rotate(${showSimpleSearch ? '180' : '0'}deg)`,
    transformOrigin: 'center',
    transition: theme.transitions.create('transform'),
  }),
)

export const InventoryAdvanceSearch = ({ value: searchCrit, onChange }: InventoryAdvanceSearchProps) => {
  const [searchCritValue, setSearchCritValue] = useState('')
  const [config, setConfig] = useState<InventoryAdvanceSearchConfig[]>([
    { id: Math.random(), key: null, op: null, value: null, kindProp: null },
  ])
  const [kind, setKind] = useState<string | null>(null)
  const [showSimpleSearch, setShowSimpleSearch] = useState(true)

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
    setConfig([{ id: Math.random(), key: null, op: null, value: null, kindProp: null }])
  }, [kind])

  useEffect(() => {
    const configJoined = config
      .map((item) => {
        if (typeof item === 'string' || !item) {
          return item
        }
        if (item.key && item.op && item.value && item.kindProp?.kind.type === 'simple') {
          return `${item.key} ${item.op} ${item.value}`
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
      <Collapse in={showSimpleSearch}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<InventoryFormsSkeleton />}>
            <InventoryForm config={config} setConfig={setConfig} searchCrit={searchCrit} kind={kind} setKind={setKind} />
          </Suspense>
        </NetworkErrorBoundary>
      </Collapse>
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
      <Box my={2}>
        <Divider>
          <IconButton onClick={() => setShowSimpleSearch((prev) => !prev)}>
            <StyledArrowDropDownIcon showSimpleSearch={showSimpleSearch} />
          </IconButton>
        </Divider>
      </Box>
    </>
  )
}
