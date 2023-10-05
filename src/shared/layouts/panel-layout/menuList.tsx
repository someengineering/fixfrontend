import { Trans } from '@lingui/macro'
import { SvgIconComponent } from '@mui/icons-material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InboxIcon from '@mui/icons-material/Inbox'
import MailIcon from '@mui/icons-material/Mail'
import SettingsIcon from '@mui/icons-material/Settings'
import { ComponentType, ReactNode } from 'react'

export interface MenuListItem {
  name: ReactNode
  route: string
  Icon: SvgIconComponent
}

type DefaultMenuModalListItemProps = {
  onModalClose: () => void
}

export interface MenuModalListItem<T extends DefaultMenuModalListItemProps = DefaultMenuModalListItemProps> {
  name: ReactNode
  route: 'modal'
  props: Partial<T>
  Component: ComponentType<T>
  Icon: SvgIconComponent
}

export const menuList: MenuListItem[] = [
  {
    name: <Trans>Dashboard</Trans>,
    route: '/',
    Icon: DashboardIcon,
  },
  {
    name: 'Inbox',
    route: '/inbox',
    Icon: InboxIcon,
  },
  {
    name: 'Mail',
    route: '/mail',
    Icon: MailIcon,
  },
]

export const bottomMenuList = [
  {
    name: <Trans>Panel Setup</Trans>,
    route: '/setup-cloud',
    Icon: SettingsIcon,
  },
]
