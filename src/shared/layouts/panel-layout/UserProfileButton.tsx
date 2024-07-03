import { Trans, t } from '@lingui/macro'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import WarningIcon from '@mui/icons-material/Warning'
import { Avatar, Badge, Divider, IconButton, ListItemIcon, Menu, MenuItem, MenuList, Tooltip, Typography } from '@mui/material'
import { MouseEvent as MouseEventReact, useState, useTransition } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'

interface WorkspaceMenuItemProps {
  id: string
  name: string
  selectedWorkspace?: boolean
  error?: string
  handleSelectWorkspace: (id: string) => void
}
export const WorkspaceMenuItem = ({ id, name, selectedWorkspace, error, handleSelectWorkspace }: WorkspaceMenuItemProps) => {
  const menuItem = (
    <>
      <ListItemIcon>
        <CorporateFareIcon color="primary" />
      </ListItemIcon>
      <Typography textAlign="center" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {name}
      </Typography>
    </>
  )
  return error ? (
    <Tooltip title={error} placement="left" arrow>
      <MenuItem sx={{ opacity: 0.4 }}>
        <Badge badgeContent={<WarningIcon fontSize="small" color="warning" />} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}>
          {menuItem}
        </Badge>
      </MenuItem>
    </Tooltip>
  ) : (
    <MenuItem
      onClick={selectedWorkspace ? undefined : () => handleSelectWorkspace(id)}
      selected={selectedWorkspace}
      disabled={selectedWorkspace}
      sx={selectedWorkspace ? { opacity: '1!important' } : undefined}
    >
      {menuItem}
    </MenuItem>
  )
}

export const UserProfileButton = () => {
  const { logout, workspaces, selectedWorkspace, selectWorkspace } = useUserProfile()
  const navigate = useAbsoluteNavigate()
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement>()
  const [isPending, startTransition] = useTransition()

  const handleOpenUserMenu = (event: MouseEventReact<HTMLElement, MouseEvent>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(undefined)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    startTransition(() => {
      void logout()
    })
  }

  const handleSelectWorkspace = (id: string) => {
    handleCloseUserMenu()
    startTransition(() => {
      void selectWorkspace(id).then((workspace) => {
        if (workspace?.id) {
          window.setTimeout(() => {
            navigate({ pathname: panelUI.homePage, hash: `#${workspace.id}`, search: '' }, { replace: true })
          })
        }
      })
    })
  }

  const handleGoToAccounts = () => {
    handleCloseUserMenu()
    navigate('/user-settings')
  }

  return (
    <>
      {isPending ? <FullPageLoadingSuspenseFallback forceFullPage /> : null}
      <Tooltip title={t`Profile`} arrow>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} color="primary">
          <Avatar alt={selectedWorkspace?.slug} sx={{ bgcolor: 'primary.main' }} />
        </IconButton>
      </Tooltip>
      <Menu
        id="user-profile-menu"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              backgroundImage: 'initial',
              bgcolor: 'background.paper',
              overflow: 'visible',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuList>
          {workspaces?.map(({ name, id, permissions, user_has_access }) => (
            <WorkspaceMenuItem
              key={id}
              id={id}
              handleSelectWorkspace={handleSelectWorkspace}
              name={name}
              selectedWorkspace={selectedWorkspace?.id === id}
              error={
                permissions.includes('read') && user_has_access
                  ? undefined
                  : t`You don't have the permission to view this workspace, contact the workspace owner for more information.`
              }
            />
          ))}
          <Divider />
          <MenuItem onClick={handleGoToAccounts}>
            <ListItemIcon>
              <SettingsIcon color="primary" />
            </ListItemIcon>
            <Typography textAlign="center">
              <Trans>User Settings</Trans>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <Typography textAlign="center">
              <Trans>Log Out</Trans>
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
