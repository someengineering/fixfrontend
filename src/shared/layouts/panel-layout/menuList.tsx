import { Trans } from '@lingui/macro'
import { FC, ReactNode } from 'react'
import { DashboardIcon, LabProfileIcon, LocalPoliceIcon, SearchIcon, SvgIconProps } from 'src/assets/icons'

export interface MenuListItem {
  name: ReactNode
  route: string
  exact?: boolean
  Icon: FC<SvgIconProps>
}

export const mainMenuList: MenuListItem[] = [
  {
    name: <Trans>Dashboard</Trans>,
    route: '/dashboard',
    Icon: DashboardIcon,
  },
  {
    name: <Trans>Inventory</Trans>,
    route: '/inventory',
    exact: true,
    Icon: LabProfileIcon,
  },
  {
    name: <Trans>Explorer</Trans>,
    route: '/inventory/search',
    Icon: SearchIcon,
  },
  {
    name: <Trans>Compliance</Trans>,
    route: '/security',
    Icon: LocalPoliceIcon,
  },
]
