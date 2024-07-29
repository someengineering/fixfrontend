import { t } from '@lingui/macro'
import WarningIcon from '@mui/icons-material/Warning'
import { Badge, BadgeProps, Theme, Tooltip, TooltipProps, useMediaQuery } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'

interface DisabledWithPermissionProps extends PropsWithChildren<Omit<TooltipProps, 'title' | 'children'>> {
  title?: ReactNode
  access?: boolean
  hasPermission: boolean
  badgeProps?: BadgeProps
}

export const DisabledWithPermission = ({
  hasPermission,
  placement,
  access,
  title,
  children,
  badgeProps,
  ...props
}: DisabledWithPermissionProps) => {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  return hasPermission ? (
    children
  ) : children ? (
    <Tooltip
      title={
        (title ?? access)
          ? t`You don't have the permission to access this, contact the workspace owner for more information.`
          : t`You don't have the permission to change this, contact the workspace owner for more information.`
      }
      arrow
      {...props}
      placement={placement && isMobile && !placement.includes('top') && !placement.includes('bottom') ? 'bottom' : placement}
    >
      <Badge
        badgeContent={<WarningIcon fontSize="small" color="warning" />}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        {...badgeProps}
      >
        {children}
      </Badge>
    </Tooltip>
  ) : null
}
