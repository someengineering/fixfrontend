import { Trans } from '@lingui/macro'
import { Autocomplete, Button, Popover, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { AutoCompletePreDefinedItems } from './utils'

interface InventoryFormKindPopoverProps {
  open: HTMLElement | null
  kinds: string[]
  options: AutoCompletePreDefinedItems['kinds']
  onChange: (values: string[]) => void
  onClose: () => void
}

export const InventoryFormKindPopover = ({ onChange, onClose, open, kinds, options }: InventoryFormKindPopoverProps) => {
  const [values, setValues] = useState(kinds)
  useEffect(() => {
    setValues(kinds)
  }, [kinds])
  const onSubmit = () => {
    onChange(values)
    onClose()
  }

  const autoCompleteValues = values.map((value) => options.find((option) => option.value === value) ?? { value, label: value })

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
        <Stack direction="row" flexWrap="wrap" overflow="auto">
          <Autocomplete
            fullWidth
            size="small"
            multiple
            value={autoCompleteValues}
            onChange={(_, newValues) => setValues(newValues.map((value) => value.value))}
            options={options}
            renderInput={(params) => <TextField {...params} label={<Trans>Kinds</Trans>} />}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                setValues(kinds)
                onClose()
              }}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              color="warning"
              variant="outlined"
              onClick={() => {
                setValues([])
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
