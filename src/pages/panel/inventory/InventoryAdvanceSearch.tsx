import { Trans } from '@lingui/macro'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownCircleOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Collapse, Divider, FormHelperText, IconButton, TextField, Typography, styled } from '@mui/material'
import { ChangeEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  onChange: (value?: string, hide?: string) => void
  hasError: boolean
}

const StyledArrowDropDownIcon = styled(ArrowDropDownIcon, { shouldForwardProp: shouldForwardProp })<{ showAdvanceSearch: boolean }>(
  ({ theme, showAdvanceSearch }) => ({
    transform: `rotate(${showAdvanceSearch ? '180' : '0'}deg)`,
    transformOrigin: 'center',
    transition: theme.transitions.create('transform'),
  }),
)

export const InventoryAdvanceSearch = ({ value: searchCrit, onChange, hasError }: InventoryAdvanceSearchProps) => {
  const initializedRef = useRef(false)
  const [searchParams] = useSearchParams()
  const hideFilters = searchParams.get('hide') === 'true'
  const [searchCritValue, setSearchCritValue] = useState(searchCrit === 'all' || !searchCrit ? '' : searchCrit)
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== searchCritValue) {
      onChange(undefined, !e.target.value || e.target.value === 'all' ? '' : 'true')
    }
    handleChangeValue(e.target.value)
  }

  useEffect(() => {
    if (initializedRef.current) {
      const configJoined = config
        .map((item) => {
          if (typeof item === 'string' || !item) {
            return item
          }
          if (item.property && item.op && item.value && item.fqn) {
            const value =
              item.fqn === 'string' && item.value !== 'null'
                ? item.op === 'in' || item.op === 'not in'
                  ? JSON.stringify(getArrayFromInOP(item.value, true))
                  : `"${item.value}"`
                : item.value
            return `${item.property} ${item.op} ${value}`
          }
          return null
        })
        .filter((filter) => filter)
        .join(' and ')
      const result = (kind ? `is(${kind})${configJoined ? ' and ' : ''}` : '') + configJoined
      handleChangeValue(result || 'all')
    }
    initializedRef.current = true
  }, [config, handleChangeValue, kind])

  return (
    <>
      <Collapse in={!hideFilters}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<InventoryFormsSkeleton />}>
            {hideFilters ? null : (
              <InventoryForm config={config} setConfig={setConfig} searchCrit={searchCrit || 'all'} kind={kind} setKind={setKind} />
            )}
          </Suspense>
        </NetworkErrorBoundary>
      </Collapse>
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
          error={hasError}
        />
      </Collapse>
      <Collapse in={hasError}>
        <FormHelperText>
          <Typography variant="caption" color="error" mx={1.75}>
            <Trans>Oops! It looks like your query didn't match our format. Please check and try again.</Trans>
          </Typography>
        </FormHelperText>
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
