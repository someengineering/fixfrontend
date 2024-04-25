import { Trans, t } from '@lingui/macro'
import { Button, Popover, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

interface InventoryFormFullTextSearchPopoverProps {
  open: HTMLElement | null
  fullTextSearch: string
  onChange: (fullTextSearch: string) => void
  onClose: () => void
}

export const InventoryFormFullTextSearchPopover = ({
  onChange,
  onClose,
  open,
  fullTextSearch,
}: InventoryFormFullTextSearchPopoverProps) => {
  const [value, setValue] = useState(fullTextSearch ?? '')
  useEffect(() => {
    setValue(fullTextSearch)
  }, [fullTextSearch])
  const onSubmit = () => {
    onChange(value)
    onClose()
  }

  return (
    <Popover open={!!open} anchorEl={open} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} onClose={onSubmit}>
      <Stack
        p={1}
        spacing={1}
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Stack direction="row" flexWrap="wrap" overflow="auto" pt={2}>
          <TextField
            autoFocus
            id="full-text-search"
            name="full-text-search"
            autoComplete="search"
            label={t`Full-text search`}
            variant="outlined"
            fullWidth
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value ?? '')}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                onClose()
              }}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              color="warning"
              variant="outlined"
              onClick={() => {
                setValue('')
              }}
            >
              <Trans>clear</Trans>
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button color="primary" variant="contained" type="submit">
              <Trans>Submit</Trans>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Popover>
  )
}
