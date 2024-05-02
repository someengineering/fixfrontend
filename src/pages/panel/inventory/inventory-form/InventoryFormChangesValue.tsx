import { Trans, t } from '@lingui/macro'
import { Button, FormControl, InputLabel, MenuItem, Popover, Select, Stack } from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface InventoryFormChangeValueProps {
  open: HTMLElement | null
  searchParamsChange: string | null
  searchParamsAfter: string | null
  searchParamsBefore: string | null
  onChange: (searchParamsChange: string | null, searchParamsAfter: string | null, searchParamsBefore: string | null) => void
  onClose: () => void
}

export const InventoryFormChangeValue = ({
  onChange,
  onClose,
  open,
  searchParamsAfter,
  searchParamsBefore,
  searchParamsChange,
}: InventoryFormChangeValueProps) => {
  const [change, setChange] = useState(searchParamsChange ?? '')
  const [after, setAfter] = useState(searchParamsAfter)
  const [before, setBefore] = useState(searchParamsBefore)
  useEffect(() => {
    setChange(searchParamsChange ?? '')
  }, [searchParamsChange])
  useEffect(() => {
    setAfter(searchParamsAfter)
  }, [searchParamsAfter])
  useEffect(() => {
    setBefore(searchParamsBefore)
  }, [searchParamsBefore])
  const onSubmit = () => {
    onChange(change, after, before)
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
          <FormControl>
            <InputLabel id="change-type">
              <Trans>Change Type</Trans>
            </InputLabel>
            <Select
              sx={{ minWidth: 200, mb: 1, mr: 1, height: '100%' }}
              value={change}
              variant="outlined"
              onChange={(e) => setChange(e.target.value)}
              size="small"
              autoFocus={!change}
              label={t`Change Type`}
              labelId="change-type"
            >
              <MenuItem value="node_created">
                <Trans>Node Created</Trans>
              </MenuItem>
              <MenuItem value="node_updated">
                <Trans>Node Updated</Trans>
              </MenuItem>
              <MenuItem value="node_deleted">
                <Trans>Node Deleted</Trans>
              </MenuItem>
              <MenuItem value="node_vulnerable">
                <Trans>Node Vulnerable</Trans>
              </MenuItem>
              <MenuItem value="node_compliant">
                <Trans>Node Compliant</Trans>
              </MenuItem>
            </Select>
          </FormControl>
          <DateTimeRangePicker
            sx={{ mb: 1 }}
            value={[after ? dayjs(after) : null, before ? dayjs(before) : null]}
            onChange={([after, before]) => {
              setAfter(after?.toISOString() ?? null)
              setBefore(before?.toISOString() ?? null)
            }}
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
                setAfter(null)
                setBefore(null)
                setChange('')
              }}
            >
              <Trans>clear</Trans>
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button color="primary" variant="contained" type="submit" disabled={!change || !after || !before}>
              <Trans>Submit</Trans>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Popover>
  )
}
