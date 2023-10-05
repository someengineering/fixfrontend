import { Box, Divider, Fade, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal } from '@mui/material'
import { MouseEvent as ReactMouseEvent, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { panelUI } from 'src/shared/constants'
import { getInitiated } from 'src/shared/utils/localstorage'
import { MenuListItem, MenuModalListItem, bottomMenuList, menuList } from './menuList'

interface DrawerMenuProps {
  open: boolean
}

type DrawerMenuItemProps = DrawerMenuProps & MenuListItem

const DrawerMenuItem = ({ open, Icon, name, route }: DrawerMenuItemProps) => {
  const match = useMatch(route)
  const navigate = useNavigate()
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(route)
  }
  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        selected={match != null}
        href={route}
        sx={{
          height: panelUI.headerHeight,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText primary={name} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  )
}

type DrawerModalMenuItemProps = DrawerMenuProps & MenuModalListItem

const DrawerModalMenuItem = ({ open, Icon, name, Component, props }: DrawerModalMenuItemProps) => {
  const [modalOpen, setModalOpen] = useState(!(getInitiated() || false))
  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
  }
  return (
    <>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            height: panelUI.headerHeight,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={handleModalOpen}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText primary={name} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
      <Modal open={modalOpen} onClose={handleModalClose} closeAfterTransition>
        <Fade in={modalOpen}>
          <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
            <Box p={3} bgcolor="background.paper" boxShadow={24} width="calc(100% - 20px)" m="0 auto" maxWidth={panelUI.maxPageModalWidth}>
              <Component {...props} onModalClose={handleModalClose} />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export const DrawerMenu = ({ open }: DrawerMenuProps) => {
  const menuListMap = (item: MenuListItem | MenuModalListItem, index: number) =>
    item.route === 'modal' ? (
      <DrawerModalMenuItem open={open} key={index} {...(item as MenuModalListItem)} route="modal" />
    ) : (
      <DrawerMenuItem open={open} key={index} {...item} />
    )
  return (
    <Box display="flex" justifyContent="space-between" flexDirection="column" flexGrow={1}>
      <List>{menuList.map(menuListMap)}</List>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Divider />
      </Box>
      <List>{bottomMenuList.map(menuListMap)}</List>
    </Box>
  )
}
