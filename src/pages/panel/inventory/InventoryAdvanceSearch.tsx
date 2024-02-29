import { Trans } from '@lingui/macro'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Collapse, FormHelperText, IconButton, Stack, TextField, Typography } from '@mui/material'
import { ChangeEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InventoryAdvanceSearchInfo } from './InventoryAdvanceSearchInfo'
import { InventoryForm } from './InventoryForm'
import { InventoryFormsSkeleton } from './InventoryForms.skeleton'
import { InventoryAdvanceSearchConfig, inventoryAdvanceSearchConfigToString } from './utils'

interface InventoryAdvanceSearchProps {
  value: string
  onChange: (value?: string, hide?: string) => void
  hasError: boolean
}

const defaultConfig = () => [{ id: Math.random(), property: null, op: null, value: null, fqn: null }]

export const InventoryAdvanceSearch = ({ value: searchCrit, onChange, hasError }: InventoryAdvanceSearchProps) => {
  const initializedRef = useRef(false)
  const [focused, setIsFocused] = useState(false)
  const [searchParams] = useSearchParams()
  const hideFilters = searchParams.get('hide') === 'true'
  const [searchCritValue, setSearchCritValue] = useState(searchCrit === 'all' || !searchCrit ? '' : searchCrit)
  const [config, setConfig] = useState<InventoryAdvanceSearchConfig[]>(defaultConfig())
  const [kind, setKind] = useState<string | null>(null)

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

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    },
    [],
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value || value === 'all') {
      handleReset(true)
    }
    if (value !== searchCritValue) {
      onChange(undefined, !value || value === 'all' ? '' : 'true')
    }
    handleChangeValue(value)
  }

  useEffect(() => {
    setSearchCritValue(searchCrit === 'all' || !searchCrit ? '' : searchCrit)
  }, [searchCrit])

  useEffect(() => {
    if (initializedRef.current) {
      const configJoined = config
        .map(inventoryAdvanceSearchConfigToString)
        .filter((filter) => filter)
        .join(' and ')
      const result = (kind ? `is(${kind})${configJoined ? ' and ' : ''}` : '') + configJoined
      handleChangeValue(result || 'all')
    }
    initializedRef.current = true
  }, [config, handleChangeValue, kind])

  const handleReset = (noValueSet?: boolean) => {
    if (!noValueSet) {
      onChange(undefined, '')
      handleChangeValue('')
    }
    setConfig(defaultConfig())
    setKind(null)
  }

  return (
    <Box mb={2}>
      <Collapse in={!hideFilters}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<InventoryFormsSkeleton />}>
            {hideFilters ? null : (
              <InventoryForm config={config} setConfig={setConfig} searchCrit={searchCrit || 'all'} kind={kind} setKind={setKind} />
            )}
          </Suspense>
        </NetworkErrorBoundary>
      </Collapse>
      <TextField
        variant="outlined"
        margin="dense"
        label={
          <Stack direction="row" gap={1}>
            <Collapse in={!focused && !searchCritValue} orientation="horizontal">
              <SearchIcon />
            </Collapse>
            <Trans>Advanced search query</Trans>
          </Stack>
        }
        fullWidth
        size="small"
        inputProps={{
          sx: {
            ml: 1,
          },
        }}
        value={searchCritValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onReset={() => handleReset()}
        InputProps={{
          startAdornment: focused || searchCritValue ? <SearchIcon /> : undefined,
          endAdornment: (
            <Stack direction="row" alignItems="center" mr={-1}>
              {searchCritValue ? (
                <IconButton size="small" onClick={() => handleReset()}>
                  <CloseIcon />
                </IconButton>
              ) : null}
              <InventoryAdvanceSearchInfo />
            </Stack>
          ),
        }}
        error={hasError}
      />
      <Collapse in={hasError}>
        <FormHelperText>
          <Typography variant="caption" color="error" mx={1.75}>
            <Trans>Oops! It looks like your query didn't match our format. Please check and try again.</Trans>
          </Typography>
        </FormHelperText>
      </Collapse>
    </Box>
  )
}
