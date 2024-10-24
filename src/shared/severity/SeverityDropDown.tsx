import { Button, ButtonProps, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { SeverityType } from 'src/shared/types/server-shared'
import { SeverityItemWithText } from './SeverityItemWithText'

interface SeverityDropDownProps extends Omit<ButtonProps, 'value' | 'onChange'> {
  value: SeverityType
  onChange: (value: SeverityType) => void
}

const severities = ['low', 'medium', 'high', 'critical'] as const

export const SeverityDropDown = ({ onChange, value, ...rest }: SeverityDropDownProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClose = () => setAnchorEl(null)
  const handleChange = (severity: SeverityType) => {
    setAnchorEl(null)
    onChange(severity)
  }
  return (
    <>
      <Button size="small" {...rest} onClick={(e) => setAnchorEl(e.currentTarget)}>
        <SeverityItemWithText severity={value} />
      </Button>
      <Menu
        id="severity-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'severity-menu-button',
        }}
      >
        {severities.map((severity) => (
          <MenuItem key={severity} onClick={() => handleChange(severity)} selected={value === severity}>
            <SeverityItemWithText severity={severity} />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
