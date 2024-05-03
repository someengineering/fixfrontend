import { Trans } from '@lingui/macro'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  ButtonBase,
  Checkbox,
  CheckboxProps,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  Popover,
  Stack,
  TextField,
  Typography,
  backdropClasses,
} from '@mui/material'
import { useDebounce } from '@uidotdev/usehooks'
import { ReactNode, useEffect, useId, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { AutoCompleteValue } from 'src/shared/types/shared'

interface InventoryFormDefaultValueProps {
  open: HTMLElement | null
  values: string[]
  options: AutoCompleteValue[]
  slotProps?: {
    listItemProps?: ListItemProps
    listItemButtonProps?: ListItemButtonProps
    checkboxProps?: CheckboxProps
    listItemTextProps?: ListItemTextProps
  }
  label: string
  labelPlural?: string
  showItemLabel?: (item: AutoCompleteValue) => ReactNode
  onChange: (values: string[]) => void
  onClose: () => void
  withAddButton?: boolean
}

interface InventoryFormDefaultValueItemProp {
  checked: boolean
  item: AutoCompleteValue
  slotProps?: {
    listItemProps?: ListItemProps
    listItemButtonProps?: ListItemButtonProps
    checkboxProps?: CheckboxProps
    listItemTextProps?: ListItemTextProps
  }
  label: string
  showItemLabel?: (item: AutoCompleteValue) => ReactNode
  onChange: (value: string, checked: boolean) => void
}

const InventoryFormDefaultValueItem = ({
  checked,
  slotProps: { listItemProps, listItemButtonProps, checkboxProps, listItemTextProps } = {},
  label,
  item,
  onChange,
  showItemLabel,
}: InventoryFormDefaultValueItemProp) => {
  const id = useId()
  const labelId = `${id}_${label}_${item.value}`.replace(' ', '_')
  return (
    <ListItem disablePadding {...listItemProps}>
      <ListItemButton role={undefined} onClick={() => onChange(item.value, !checked)} dense {...listItemButtonProps}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            id={`label_${labelId}`}
            inputProps={{ 'aria-labelledby': labelId }}
            checked={checked}
            sx={{ p: 0, pr: 1 }}
            {...checkboxProps}
          />
          <ListItemText id={labelId} primary={showItemLabel ? showItemLabel(item) : item.label} {...listItemTextProps} />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  )
}

export const InventoryFormDefaultValue = ({
  onChange,
  onClose,
  open,
  slotProps,
  values,
  label,
  labelPlural,
  options,
  showItemLabel,
  withAddButton,
}: InventoryFormDefaultValueProps) => {
  const [typed, setTyped] = useState('')
  const [selectedValues, setSelectedValues] = useState(values)
  const debouncedValues = useDebounce(values, panelUI.fastInputChangeDebounce)

  useEffect(() => {
    if (open) {
      onChange(debouncedValues)
    }
  }, [debouncedValues, onChange, open])

  useEffect(() => {
    setSelectedValues(values)
  }, [values])

  const onSubmit = () => {
    onChange(selectedValues)
    onClose()
  }

  const handleChange = (value: string, checked: boolean) => {
    setSelectedValues((prev) => {
      const index = prev.indexOf(value)
      if (checked && index === -1) {
        return [...prev, value]
      } else if (index > -1) {
        return prev.filter((i) => i !== value)
      }
      return prev
    })
  }

  const list = options
    .filter((i) => i.value.toLowerCase().includes(typed.toLowerCase()) || i.label.toLowerCase().includes(typed.toLowerCase()))
    .sort((prev, value) => (selectedValues.includes(value.value) ? 1 : -1) - (selectedValues.includes(prev.value) ? 1 : -1))

  return (
    <Popover
      open={!!open}
      anchorEl={open}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={withAddButton ? onClose : onSubmit}
      slotProps={{
        paper: {
          sx: {
            overflow: 'hidden',
            display: 'flex',
          },
        },
      }}
      sx={{
        [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
        maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
      }}
    >
      <Stack p={1} spacing={1} maxHeight="100%">
        <TextField
          size="small"
          label={<Trans>Search {labelPlural ?? `${label}s`}</Trans>}
          InputProps={{
            endAdornment: (
              <Stack direction="row" spacing={0.5}>
                {typed ? (
                  <ButtonBase onClick={() => setTyped('')} sx={{ borderRadius: '50%' }}>
                    <ClearIcon fontSize="small" />
                  </ButtonBase>
                ) : null}
                <SearchIcon fontSize="small" />
              </Stack>
            ),
          }}
          value={typed}
          sx={{ flexGrow: 0, flexShrink: 0 }}
          onChange={(e) => setTyped(e.currentTarget.value)}
        />

        {list.length ? (
          <List component={Stack} overflow="auto" flexGrow={1} flexShrink={1}>
            {list.map((item) => (
              <InventoryFormDefaultValueItem
                key={item.value}
                checked={selectedValues.includes(item.value)}
                onChange={handleChange}
                slotProps={slotProps}
                label={label}
                item={item}
                showItemLabel={showItemLabel}
              />
            ))}
          </List>
        ) : (
          <Stack alignItems="center" justifyContent="center" height={50} flexGrow={0} flexShrink={0}>
            <Typography>
              <Trans>
                No {label} found for {typed}
              </Trans>
            </Typography>
          </Stack>
        )}
        <Divider sx={{ flexGrow: 0, flexShrink: 0 }} />
        <Stack alignItems="end" position="sticky" top={0} left={0} flexGrow={0} flexShrink={0}>
          <Button variant="contained" color="primary" onClick={onSubmit} size="small" startIcon={<EditIcon fontSize="small" />}>
            <Trans>Change</Trans>
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}
