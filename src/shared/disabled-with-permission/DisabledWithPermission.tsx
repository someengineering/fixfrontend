import { t } from '@lingui/macro'
import WarningIcon from '@mui/icons-material/Warning'
import { Badge, BadgeProps, Tooltip, TooltipProps } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'

interface DisabledWithPermissionProps extends PropsWithChildren<Omit<TooltipProps, 'title' | 'children'>> {
  title?: ReactNode
  access?: boolean
  hasPermission: boolean
  badgeProps?: BadgeProps
}

export const DisabledWithPermission = ({ hasPermission, access, title, children, badgeProps, ...props }: DisabledWithPermissionProps) => {
  return hasPermission ? (
    children
  ) : children ? (
    <Tooltip
      title={
        title ?? access
          ? t`You don't have the permission to access this, contact the workspace owner for more information.`
          : t`You don't have the permission to change this, contact the workspace owner for more information.`
      }
      {...props}
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
