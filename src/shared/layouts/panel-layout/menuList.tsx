import { Trans } from '@lingui/macro'
// eslint-disable-next-line no-restricted-imports
import { SvgIconComponent } from '@mui/icons-material'
import CloudIcon from '@mui/icons-material/Cloud'
import HistoryIcon from '@mui/icons-material/History'
import SearchIcon from '@mui/icons-material/Search'
// import HistoryIcon from '@mui/icons-material/History'
import InventoryIcon from '@mui/icons-material/Inventory'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences'
import SecurityIcon from '@mui/icons-material/Security'
import { ComponentType, ReactNode } from 'react'
import { usePermissionCheck } from './check-hooks'
import { useHasBenchmarkCheck } from './check-hooks/useHasBenchmarkCheck'

export interface MenuListItem {
  name: ReactNode
  route: string
  routeSearch?: string
  notRouteSearchMatch?: boolean
  Icon: SvgIconComponent
  useGuard?: () => boolean
  hideOnGuard?: boolean
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
    name: <Trans>Inventory</Trans>,
    route: '/inventory',
    // routeSearch: 'changes=true',
    // notRouteSearchMatch: true,
    Icon: InventoryIcon,
    hideOnGuard: true,
    useGuard: useHasBenchmarkCheck,
    children: [
      {
        Icon: SearchIcon,
        name: <Trans>Search</Trans>,
        route: '/inventory/search',
      },
      {
        Icon: HistoryIcon,
        name: <Trans>History</Trans>,
        route: '/inventory/history',
      },
    ],
  },
  // {
  //   name: <Trans>History</Trans>,
  //   route: '/inventory',
  //   routeSearch: 'changes=true',
  //   Icon: HistoryIcon,
  //   useGuard: useHasBenchmarkCheck,
  // },
  {
    name: <Trans>Security</Trans>,
    route: '/security',
    Icon: SecurityIcon,
  },
]

export const bottomMenuList: MenuListItem[] = [
  {
    name: <Trans>Workspace Settings</Trans>,
    route: '/workspace-settings',
    Icon: RoomPreferencesIcon,
    useGuard: () => usePermissionCheck('readSettings'),
    hideOnGuard: true,
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
        hideOnGuard: true,
        useGuard: () => usePermissionCheck('readBilling'),
      },
      // {
      //   Icon: FolderCopyIcon,
      //   name: <Trans>External Directories</Trans>,
      //   route: '/workspace-settings/external-directories',
      // },
    ],
  },
]
