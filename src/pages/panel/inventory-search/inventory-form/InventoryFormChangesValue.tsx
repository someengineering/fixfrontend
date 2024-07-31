import { Stack } from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import { useState } from 'react'
import { InventoryFormChangePicker } from './InventoryFormChangePicker'
import { allHistoryChangesOptions } from './utils/allHistoryChangesOptions'

interface InventoryFormChangeValueProps {
  searchParamsChanges: string[]
  searchParamsAfter: string | null
  searchParamsBefore: string | null
  onChange: (searchParamsChanges: string[], searchParamsAfter: string | null, searchParamsBefore: string | null) => void
}

export const InventoryFormChangeValue = ({
  onChange,
  searchParamsAfter,
  searchParamsBefore,
  searchParamsChanges,
}: InventoryFormChangeValueProps) => {
  const [rangePosition, setRangePosition] = useState<'start' | 'end'>(searchParamsAfter ? 'end' : 'start')
  return (
    <Stack width="100%" flexGrow={1} direction="row" flexWrap="wrap" overflow="auto" mt={-2} pt={2} mb={-1}>
      <InventoryFormChangePicker
        onChange={onChange}
        searchParamsAfter={searchParamsAfter}
        searchParamsBefore={searchParamsBefore}
        searchParamsChanges={searchParamsChanges}
      />
      <DateTimeRangePicker
        disableFuture
        closeOnSelect
        rangePosition={rangePosition}
        onRangePositionChange={setRangePosition}
        sx={{ mb: 1 }}
        slotProps={{
          fieldSeparator: {
            fontWeight: 700,
            color: 'primary.main',
            sx: {
              mr: '-8px !important',
              ml: '8px !important',
            },
          },
          textField: {
            InputLabelProps: {
              size: 'small',
              sx: {
                mt: '2px',
                fontSize: 14,
                fontWeight: 700,
                color: 'primary.main',
              },
            },
            inputProps: {
              sx: {
                height: 32,
                pl: 2,
                pr: 0.5,
                py: 0.75,
                fontSize: 14,
                fontWeight: 700,
                color: 'primary.main',
              },
            },
          },
          actionBar: {
            actions: ['today', 'accept', 'cancel', 'clear'],
          },
        }}
        value={[searchParamsAfter ? dayjs(searchParamsAfter) : null, searchParamsBefore ? dayjs(searchParamsBefore) : null]}
        onChange={([after, before]) => {
          if (after) {
            setRangePosition('end')
          }
          onChange(
            searchParamsChanges?.length ? searchParamsChanges : [...allHistoryChangesOptions],
            after?.toISOString() ?? null,
            before?.toISOString() ?? null,
          )
        }}
      />
    </Stack>
  )
}
