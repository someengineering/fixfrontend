import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Collapse,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Tooltip,
  badgeClasses,
} from '@mui/material'
import { MouseEvent as ReactMouseEvent, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useMatch, useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { DisabledWithPermission } from 'src/shared/disabled-with-permission'
import { getInitiated } from 'src/shared/utils/localstorage'
import { MenuListItem, MenuModalListItem, bottomMenuList, menuList } from './menuList'

interface DrawerMenuProps {
  open: boolean
  onClose?: (event: ReactMouseEvent<HTMLElement, MouseEvent>) => void
  indent?: number
  bottom?: boolean
}

type DrawerMenuItemProps = DrawerMenuProps & MenuListItem

const menuListMap = ({ open, onClose, indent, bottom }: DrawerMenuProps, item: MenuListItem | MenuModalListItem, index: number) =>
  item.route === 'modal' ? (
    <ErrorBoundary fallbackRender={() => null} key={index}>
      <DrawerModalMenuItem open={open} onClose={onClose} {...(item as MenuModalListItem)} route="modal" bottom={bottom} />
    </ErrorBoundary>
  ) : (
    <ErrorBoundary fallbackRender={() => null} key={index}>
      <DrawerMenuItem open={open} onClose={onClose} {...item} indent={indent} bottom={bottom} />
    </ErrorBoundary>
  )

const DrawerMenuItem = ({
  open,
  onClose,
  Icon,
  name,
  route,
  subRoute,
  routeSearch,
  notRouteSearchMatch,
  useGuard,
  hideOnGuard,
  children,
  indent = 0,
  bottom = false,
}: DrawerMenuItemProps) => {
  const mainMatch = useMatch({ path: `${route}/*` })
  const secondaryMatch = useMatch({ path: `${subRoute ?? 'invalid'}/*` })
  const match = mainMatch ?? (subRoute ? secondaryMatch : null)
  const [searchParams] = useSearchParams()
  const matchRouteSearch = routeSearch
    ? routeSearch
        .split('&')
        .map((item) => {
          const [key, value] = item.split('=')
          return searchParams.get(key) === value
        })
        .find((i) => i === (notRouteSearchMatch ? true : false)) === undefined
    : true
  const hasMatch = match !== null && matchRouteSearch
  const [collapse, setCollapse] = useState(hasMatch)
  const show = useGuard?.() ?? true
  const navigate = useAbsoluteNavigate()
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setCollapse(false)
    e.stopPropagation()
    e.preventDefault()
    onClose?.(e)
    navigate({ pathname: route, search: notRouteSearchMatch ? undefined : routeSearch })
  }
  useEffect(() => {
    setCollapse(!hasMatch)
  }, [hasMatch])
  return show || !hideOnGuard ? (
    <DisabledWithPermission
      hasPermission={show}
      access
      placement="right"
      badgeProps={{
        sx: { width: '100%', [`.${badgeClasses.badge}`]: { top: 22, left: 22 } },
      }}
    >
      <ListItem
        disablePadding
        sx={{
          display: 'block',
          pl: indent,
        }}
      >
        <ListItemButton
          selected={hasMatch}
          href={route}
          sx={{
            height: panelUI.headerHeight,
            justifyContent: open ? 'initial' : 'center',
            ...(indent
              ? {
                  borderLeftStyle: 'dashed',
                  borderLeftWidth: 1,
                  borderLeftColor: 'grey.400',
                }
              : {}),
          }}
          onClick={handleClick}
          disabled={!show}
        >
          <Tooltip title={name} enterNextDelay={panelUI.fastTooltipDelay} enterDelay={panelUI.fastTooltipDelay} arrow placement="right">
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
              <Icon />
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            primary={name}
            sx={{ opacity: open ? 1 : 0 }}
            primaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          />
          {children ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCollapse((prev) => !prev)
              }}
            >
              {(bottom ? !collapse : collapse) ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          ) : null}
        </ListItemButton>
      </ListItem>
      {children?.length ? (
        <Collapse in={!collapse}>{children.map((item, index) => menuListMap({ open, onClose, indent: indent + 1 }, item, index))}</Collapse>
      ) : null}
    </DisabledWithPermission>
  ) : null
}

type DrawerModalMenuItemProps = DrawerMenuProps & MenuModalListItem

const DrawerModalMenuItem = ({ open, onClose, Icon, name, Component, props }: DrawerModalMenuItemProps) => {
  const [modalOpen, setModalOpen] = useState(!(getInitiated() || false))
  const handleModalOpen = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    onClose?.(event)
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

export const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  return (
    <Box display="flex" justifyContent="space-between" flexDirection="column" flexGrow={1}>
      <List>{menuList.map((item, index) => menuListMap({ open, onClose }, item, index))}</List>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Divider />
      </Box>
      <List>{bottomMenuList.map((item, index) => menuListMap({ open, onClose, bottom: true }, item, index))}</List>
    </Box>
  )
}
