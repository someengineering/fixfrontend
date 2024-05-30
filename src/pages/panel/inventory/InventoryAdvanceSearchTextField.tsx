import { Trans } from '@lingui/macro'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Collapse, FormHelperText, IconButton, Stack, TextField, Typography } from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryAdvanceSearchInfo } from './InventoryAdvanceSearchInfo'

interface InventoryAdvanceSearchProps {
  hasError: boolean
}

export const InventoryAdvanceSearchTextField = ({ hasError }: InventoryAdvanceSearchProps) => {
  const [focused, setIsFocused] = useState(false)
  const [hasTextError, setHasTextError] = useState(false)
  const { updateQuery, reset, error, q } = useFixQueryParser()

  const [searchCritValue, setSearchCritValue] = useState(!q && q !== 'all' ? '' : q)

  const timeoutRef = useRef<number>()

  const handleChangeValue = useCallback(
    (value: string) => {
      setSearchCritValue(!value ? '' : value)
      setHasTextError(false)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        try {
          updateQuery(value)
        } catch (e) {
          console.info('update query error', { e, value })
          setHasTextError(true)
        } finally {
          timeoutRef.current = undefined
        }
      }, panelUI.inputChangeDebounce)
    },
    [updateQuery],
  )

  useEffect(() => {
    setSearchCritValue(q)
  }, [q])

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

  const handleReset = () => {
    reset()
    setSearchCritValue('')
    updateQuery('')
    setHasTextError(false)
  }

  const searchCritValueWithoutAll = searchCritValue === 'all' ? '' : searchCritValue

  return (
    <>
      <TextField
        variant="outlined"
        margin="dense"
        multiline
        label={
          <Stack direction="row" gap={1} mt={!focused && !searchCritValueWithoutAll ? 0.5 : undefined}>
            <Collapse in={!focused && !searchCritValueWithoutAll} orientation="horizontal">
              <SearchIcon />
            </Collapse>
            <Trans>Advanced search query</Trans>
          </Stack>
        }
        fullWidth
        size="small"
        inputProps={{ sx: { ml: 1 } }}
        value={searchCritValueWithoutAll}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onReset={reset}
        InputProps={{
          startAdornment: focused || searchCritValueWithoutAll ? <SearchIcon /> : undefined,
          endAdornment: (
            <Stack direction="row" alignItems="center" mr={-1}>
              {searchCritValueWithoutAll ? (
                <IconButton size="small" onClick={handleReset}>
                  <CloseIcon />
                </IconButton>
              ) : null}
              <InventoryAdvanceSearchInfo />
            </Stack>
          ),
        }}
        error={!!error || hasError || hasTextError}
      />
      <Collapse in={!error && !hasError && hasTextError}>
        <FormHelperText>
          <Typography variant="caption" color="error" mx={1.75}>
            <Trans>Oops! It looks like your query didn't match our format. Please check and try again.</Trans>
          </Typography>
        </FormHelperText>
      </Collapse>
    </>
  )
}
