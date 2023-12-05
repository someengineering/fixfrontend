import { Trans } from '@lingui/macro'
// eslint-disable-next-line no-restricted-imports
import { SvgIconComponent } from '@mui/icons-material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import { ComponentType, ReactNode } from 'react'
import { useHasBenchmarkCheck } from './check-hooks/useHasBenchmarkCheck'

export interface MenuListItem {
  name: ReactNode
  route: string
  Icon: SvgIconComponent
  useGuard?: () => boolean
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
    name: <Trans>Inventory</Trans>,
    route: '/inventory',
    Icon: InventoryIcon,
    useGuard: useHasBenchmarkCheck,
  },
]

export const bottomMenuList = []
