import { Trans } from '@lingui/macro'
import { List, ListItemButton, ListItemText, ListProps, MenuItem, Select, SelectProps } from '@mui/material'
import { useState } from 'react'

export type BooleanValues = 'true' | 'false' | 'null'

interface InventoryFormFilterRowBooleanWithFieldValueProps extends Omit<SelectProps, 'onChange' | 'value'> {
  value: BooleanValues | undefined
  onChange: (option: BooleanValues | undefined) => void
}

export function InventoryFormFilterRowBooleanWithFieldValue({
  onChange,
  value,
  onClose,
  onOpen,
  ...props
}: InventoryFormFilterRowBooleanWithFieldValueProps) {
  const [open, setOpen] = useState(true)

  return (
    <Select
      sx={{ minWidth: 100, height: 'fit-content' }}
      value={value ?? 'null'}
      onChange={(e) => onChange(e.target.value as BooleanValues)}
      size="small"
      open={open}
      onOpen={(e) => {
        onOpen?.(e)
        setOpen(true)
      }}
      onClose={(e) => {
        onClose?.(e)
        setOpen(false)
      }}
      {...props}
    >
      <MenuItem value="true">
        <Trans>Yes</Trans>
      </MenuItem>
      <MenuItem value="false">
        <Trans>No</Trans>
      </MenuItem>
      <MenuItem value="null">
        <Trans>Undefined</Trans>
      </MenuItem>
    </Select>
  )
}

interface InventoryFormFilterRowBooleanValueProps extends Omit<ListProps, 'onChange' | 'value'> {
  value: BooleanValues | undefined
  onChange: (option: BooleanValues | undefined) => void
  onClose?: () => void
}

export function InventoryFormFilterRowBooleanValue({ onChange, onClose, value, ...props }: InventoryFormFilterRowBooleanValueProps) {
  const handleChange = (value: BooleanValues) => {
    onClose?.()
    onChange(value)
  }
  return (
    <List dense {...props}>
      <ListItemButton onClick={() => handleChange('true')} selected={value === 'true'}>
        <ListItemText primary={<Trans>Yes</Trans>} />
      </ListItemButton>
      <ListItemButton onClick={() => handleChange('false')} selected={value === 'false'}>
        <ListItemText primary={<Trans>No</Trans>} />
      </ListItemButton>
      <ListItemButton onClick={() => handleChange('null')} selected={value === 'null'}>
        <ListItemText primary={<Trans>Undefined</Trans>} />
      </ListItemButton>
    </List>
  )
}
