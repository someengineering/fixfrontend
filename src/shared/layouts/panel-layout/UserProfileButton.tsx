import { Trans, t } from '@lingui/macro'
import { Avatar, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { MouseEvent as MouseEventReact, useState } from 'react'
import { useUserProfile } from 'src/core/auth'

export const UserProfileButton = () => {
  const { logout, organizations, selectedOrganization, selectOrganization } = useUserProfile()
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement>()
  const handleOpenUserMenu = (event: MouseEventReact<HTMLElement, MouseEvent>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(undefined)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    logout()
  }

  const handleSelectOrganization = (id: string) => {
    handleCloseUserMenu()
    selectOrganization(id)
  }

  return (
    <>
      <Tooltip title={t`Profile`}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={selectedOrganization?.slug} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="user-profile-menu"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {organizations?.map(({ slug, id }) => (
          <MenuItem
            key={id}
            onClick={selectedOrganization?.id === id ? undefined : () => handleSelectOrganization(id)}
            disabled={selectedOrganization?.id === id}
          >
            <Typography textAlign="center">{slug}</Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Typography textAlign="center">
            <Trans>Logout</Trans>
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
