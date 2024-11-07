import { Trans } from '@lingui/macro'
import { Collapse, FormHelperText, IconButton, Stack, TextField, Typography } from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { CloseIcon, SearchIcon } from 'src/assets/icons'
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

  const [searchCritValue, setSearchCritValue] = useState(q ?? '')

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
    handleChangeValue(value)
  }

  const handleReset = () => {
    reset()
    setSearchCritValue('')
    setHasTextError(false)
  }

  return (
    <>
      <TextField
        variant="outlined"
        margin="dense"
        multiline
        label={
          <Stack direction="row" gap={1} height={52} mt={0.5}>
            <Collapse in={!focused && !searchCritValue} orientation="horizontal">
              <SearchIcon />
            </Collapse>
            <Trans>Advanced search query</Trans>
          </Stack>
        }
        fullWidth
        size="small"
        slotProps={{
          htmlInput: {
            sx: { py: '0 !important' },
          },
          input: {
            sx: {
              height: 'auto',
              minHeight: 52,
            },
            startAdornment: focused || searchCritValue ? <SearchIcon /> : undefined,
            endAdornment: (
              <Stack direction="row" alignItems="center" mr={1}>
                {searchCritValue ? (
                  <IconButton size="small" onClick={handleReset}>
                    <CloseIcon />
                  </IconButton>
                ) : null}
                <InventoryAdvanceSearchInfo />
              </Stack>
            ),
          },
        }}
        value={searchCritValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onReset={handleReset}
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
