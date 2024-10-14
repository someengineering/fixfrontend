import { Trans } from '@lingui/macro'
import { ComponentType, FC, ReactNode } from 'react'
import { DashboardIcon, LabProfileIcon, LocalPoliceIcon, SearchIcon, SvgIconProps } from 'src/assets/icons'

export interface MenuListItem {
  name: ReactNode
  route: string
  exact?: boolean
  notRouteSearchMatch?: boolean
  Icon: FC<SvgIconProps>
  useGuard?: () => boolean
  hideOnGuard?: boolean
}

type DefaultMenuModalListItemProps = {
  onModalClose: () => void
}

export interface MenuModalListItem<T extends DefaultMenuModalListItemProps = DefaultMenuModalListItemProps> {
  name: ReactNode
  route: 'modal'
  props: Partial<T>
  Component: ComponentType<T>
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
    name: <Trans>Explore</Trans>,
    route: '/inventory/search',
    Icon: SearchIcon,
  },
  {
    name: <Trans>Compliance</Trans>,
    route: '/security',
    Icon: LocalPoliceIcon,
  },
]
