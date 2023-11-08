import { Trans, t } from '@lingui/macro'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, MenuList, Tooltip, Typography } from '@mui/material'
import { MouseEvent as MouseEventReact, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'

export const UserProfileButton = () => {
  const { logout, workspaces, selectedWorkspace, selectWorkspace } = useUserProfile()
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement>()
  const handleOpenUserMenu = (event: MouseEventReact<HTMLElement, MouseEvent>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(undefined)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    void logout()
  }

  const handleSelectWorkspace = (id: string) => {
    handleCloseUserMenu()
    void selectWorkspace(id)
  }

  const handleGoToAccounts = () => {
    handleCloseUserMenu()
    navigate('/accounts')
  }

  return (
    <>
      <Tooltip title={t`Profile`}>
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
          {workspaces?.map(({ slug, id }) => (
            <MenuItem
              key={id}
              onClick={selectedWorkspace?.id === id ? undefined : () => handleSelectWorkspace(id)}
              disabled={selectedWorkspace?.id === id}
            >
              <ListItemIcon>
                <CorporateFareIcon color="primary" />
              </ListItemIcon>
              <Typography textAlign="center" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {slug}
              </Typography>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleGoToAccounts}>
            <ListItemIcon>
              <SettingsIcon color="primary" />
            </ListItemIcon>
            <Typography textAlign="center">Accounts</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <Typography textAlign="center">
              <Trans>Logout</Trans>
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
