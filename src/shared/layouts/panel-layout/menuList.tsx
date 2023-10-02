import { t } from '@lingui/macro'
import { SvgIconComponent } from '@mui/icons-material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InboxIcon from '@mui/icons-material/Inbox'
import MailIcon from '@mui/icons-material/Mail'
import SettingsIcon from '@mui/icons-material/Settings'
import { ComponentType } from 'react'
import PanelSetupCloudProps from 'src/pages/panel/panel-setup-cloud/PanelSetupCloud'

export interface MenuListItem {
  name: string
  route: string
  Icon: SvgIconComponent
}

type DefaultMenuModalListItemProps = {
  onModalClose: () => void
}

export interface MenuModalListItem<T extends DefaultMenuModalListItemProps = DefaultMenuModalListItemProps> {
  name: string
  route: 'modal'
  props: Partial<T>
  Component: ComponentType<T>
  Icon: SvgIconComponent
}

export const menuList: MenuListItem[] = [
  {
    name: t`Dashboard`,
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
    name: t`Panel Setup`,
    route: 'modal',
    props: {},
    Component: PanelSetupCloudProps,
    Icon: SettingsIcon,
  } as MenuModalListItem,
]
