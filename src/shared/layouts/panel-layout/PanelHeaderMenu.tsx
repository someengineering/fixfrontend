import { ButtonProps, Menu } from '@mui/material'
import { FC, useId, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { PanelHeaderButton } from './PanelHeaderButton'

interface PanelHeaderMenuProps<IconProps extends object> extends ButtonProps {
  Icon: FC<IconProps>
  iconProps?: IconProps
}

export function PanelHeaderMenu<IconProps extends object>({
  Icon,
  iconProps = {} as IconProps,
  children,
  ...buttonProps
}: PanelHeaderMenuProps<IconProps>) {
  const [arrowLeft, setArrowLeft] = useState<null | number>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const id = `menu-${useId()}`
  const open = Boolean(anchorEl)
  const handleClose = () => setAnchorEl(null)
  return (
    <>
      <PanelHeaderButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="primary"
        aria-controls={open ? id : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        {...buttonProps}
      >
        <Icon {...iconProps} />
      </PanelHeaderButton>
      <Menu
        id={id}
        slotProps={{
          root: {
            slotProps: {
              backdrop: {
                sx: {
                  bgcolor: 'transparent',
                },
              },
            },
          },
          paper: {
            ref: (menuEl) =>
              anchorEl && menuEl
                ? window.setTimeout(() => setArrowLeft(anchorEl.offsetLeft - menuEl.offsetLeft - 6 + anchorEl.offsetWidth / 2))
                : undefined,
            sx: {
              borderRadius: '12px',
              p: 1.5,
              border: `1px solid ${panelUI.uiThemePalette.primary.divider}`,
              overflow: 'visible',
              filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.08))',
              boxShadow: 'none',
              minWidth: 50,
              bgcolor: panelUI.uiThemePalette.primary.white,
              mt: 1.5,
              '&::before':
                arrowLeft !== null
                  ? {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      borderLeft: `1px solid ${panelUI.uiThemePalette.primary.divider}`,
                      borderTop: `1px solid ${panelUI.uiThemePalette.primary.divider}`,
                      borderRight: `1px solid transparent`,
                      borderBottom: `1px solid transparent`,
                      borderTopLeftRadius: '3px',
                      top: 0,
                      left: arrowLeft,
                      width: 12,
                      height: 12,
                      bgcolor: panelUI.uiThemePalette.primary.white,
                      transform: 'translateY(-50%) rotate(45deg)',
                    }
                  : undefined,
            },
          },
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
      >
        {children}
      </Menu>
    </>
  )
}
