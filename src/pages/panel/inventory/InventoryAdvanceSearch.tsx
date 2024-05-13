import { Trans } from '@lingui/macro'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import SearchIcon from '@mui/icons-material/Search'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Badge,
  Box,
  Collapse,
  FormHelperText,
  IconButton,
  Stack,
  Tab,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { ChangeEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryAdvanceSearchInfo } from './InventoryAdvanceSearchInfo'
import { InventoryForm, InventoryFormsSkeleton } from './inventory-form'

interface InventoryAdvanceSearchProps {
  value: string
  onChange: (value?: string, hide?: string) => void
  hasChanges: boolean
  hasError: boolean
}

type TabsType = 'form' | 'advance'

export const InventoryAdvanceSearch = ({ value: searchCrit, onChange, hasError, hasChanges }: InventoryAdvanceSearchProps) => {
  const [focused, setIsFocused] = useState(false)
  const [tab, setTab] = useState<TabsType>('form')
  const {
    update: {
      current: { updateQuery, reset },
    },
    error,
    uiSimpleQuery,
    q,
  } = useFixQueryParser()
  const [searchCritValue, setSearchCritValue] = useState(!searchCrit && searchCrit !== 'all' ? '' : searchCrit)
  const hasSomethingExtra = !!q && q !== 'all' && !uiSimpleQuery()

  const timeoutRef = useRef<number>()

  const handleChangeValue = useCallback(
    (value: string) => {
      setSearchCritValue(!value ? '' : value)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        onChange(value)
        try {
          updateQuery(value)
        } catch (e) {
          console.info(e, value)
        }
        timeoutRef.current = undefined
      }, panelUI.inputChangeDebounce)
    },
    [onChange, updateQuery],
  )

  useEffect(() => {
    setSearchCritValue(q)
    onChange(q)
  }, [q, onChange])

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
    if (!value) {
      reset()
    }
    handleChangeValue(value)
  }

  useEffect(() => {
    setSearchCritValue(!searchCrit ? '' : searchCrit)
    try {
      updateQuery(!searchCrit ? '' : searchCrit)
    } catch (e) {
      console.info(e, !searchCrit ? '' : searchCrit)
    }
  }, [searchCrit, updateQuery])

  const handleReset = () => {
    reset()
    setSearchCritValue('')
    onChange('')
    updateQuery('')
  }

  return (
    <Box mb={2}>
      <TabContext value={error ? 'advance' : tab}>
        <Stack alignItems={{ xs: 'center', sm: 'end' }} borderColor="divider" borderBottom={1}>
          <TabList onChange={(_, val) => setTab(val as TabsType)} sx={{ minHeight: 'initial' }}>
            <Tab
              disabled={!!error}
              icon={<ListAltIcon />}
              iconPosition="start"
              label={
                hasSomethingExtra ? (
                  <Badge
                    slotProps={{
                      badge: {
                        style: { left: -30 },
                      },
                    }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    badgeContent={
                      <Tooltip
                        title={
                          <Alert color="info" variant="outlined">
                            <Trans>
                              <AlertTitle>This search is complex.</AlertTitle>
                              The combo boxes below may not display all filter details but can help narrow your results. For full control,
                              please use the Advanced tab.
                            </Trans>
                          </Alert>
                        }
                      >
                        <InfoIcon color="info" />
                      </Tooltip>
                    }
                  >
                    <Trans>Form</Trans>
                  </Badge>
                ) : (
                  <Trans>Form</Trans>
                )
              }
              value="form"
              sx={{ minHeight: 'initial' }}
            />
            <Tab
              icon={<ManageSearchIcon />}
              iconPosition="start"
              label={<Trans>Advanced</Trans>}
              value="advance"
              sx={{ minHeight: 'initial' }}
            />
          </TabList>
        </Stack>
        <TabPanel value="form" sx={{ p: 0 }}>
          {!error ? (
            <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
              <Suspense fallback={<InventoryFormsSkeleton withChange={hasChanges} />}>
                <InventoryForm />
              </Suspense>
            </NetworkErrorBoundary>
          ) : null}
        </TabPanel>
        <TabPanel value="advance" sx={{ p: 0 }}>
          <TextField
            variant="outlined"
            margin="dense"
            multiline
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
            inputProps={{ sx: { ml: 1 } }}
            value={searchCritValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onReset={reset}
            InputProps={{
              startAdornment: focused || searchCritValue ? <SearchIcon /> : undefined,
              endAdornment: (
                <Stack direction="row" alignItems="center" mr={-1}>
                  {searchCritValue ? (
                    <IconButton size="small" onClick={handleReset}>
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                  <InventoryAdvanceSearchInfo />
                </Stack>
              ),
            }}
            error={!!error || hasError}
          />
        </TabPanel>
      </TabContext>
      <Collapse in={!!error || hasError}>
        <FormHelperText>
          <Typography variant="caption" color="error" mx={1.75}>
            <Trans>Oops! It looks like your query didn't match our format. Please check and try again.</Trans>
          </Typography>
        </FormHelperText>
      </Collapse>
    </Box>
  )
}
