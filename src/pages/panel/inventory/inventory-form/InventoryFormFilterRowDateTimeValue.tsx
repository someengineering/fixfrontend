import { Trans } from '@lingui/macro'
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { TermValue } from 'src/shared/fix-query-parser'

interface InventoryFormFilterRowDateTimeValueProps extends Omit<DateTimePickerProps<Dayjs>, 'onChange' | 'value' | 'open' | 'setOpen'> {
  value: TermValue
  onChange: (option: string | null) => void
}

export function InventoryFormFilterRowDateTimeValue({
  onChange,
  onClose,
  onOpen,
  value,
  ...props
}: InventoryFormFilterRowDateTimeValueProps) {
  const [open, setOpen] = useState(true)

  return (
    <DateTimePicker
      slotProps={{ textField: { size: 'small' } }}
      label={<Trans>Date Time Picker</Trans>}
      {...props}
      onOpen={() => {
        onOpen?.()
        setOpen(true)
      }}
      onClose={() => {
        onClose?.()
        setOpen(false)
      }}
      open={open}
      value={dayjs(typeof value === 'string' ? value : undefined)}
      onChange={(val) => onChange(val?.toISOString() ?? null)}
    />
  )
}
