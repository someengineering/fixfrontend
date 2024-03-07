import { Trans } from '@lingui/macro'
// eslint-disable-next-line no-restricted-imports
import { SvgIconComponent } from '@mui/icons-material'
import CloudIcon from '@mui/icons-material/Cloud'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences'
import { ComponentType, ReactNode } from 'react'
import { useHasBenchmarkCheck } from './check-hooks/useHasBenchmarkCheck'

export interface MenuListItem {
  name: ReactNode
  route: string
  Icon: SvgIconComponent
  useGuard?: () => boolean
  children?: MenuListItem[]
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

export const bottomMenuList: MenuListItem[] = [
  {
    name: <Trans>Workspace Settings</Trans>,
    route: '/workspace-settings',
    Icon: RoomPreferencesIcon,
    children: [
      {
        Icon: CloudIcon,
        name: <Trans>Accounts</Trans>,
        route: '/workspace-settings/accounts',
      },
      {
        Icon: PeopleIcon,
        name: <Trans>Users</Trans>,
        route: '/workspace-settings/users',
      },
      {
        Icon: ReceiptIcon,
        name: <Trans>Billing</Trans>,
        route: '/workspace-settings/billing-receipts',
      },
      // {
      //   Icon: FolderCopyIcon,
      //   name: <Trans>External Directories</Trans>,
      //   route: '/workspace-settings/external-directories',
      // },
    ],
  },
]
