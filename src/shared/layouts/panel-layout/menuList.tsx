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

// export const menuList: MenuListItem[] = [
//   {
//     name: <Trans>Inventory</Trans>,
//     route: '/inventory-summary',
//     subRoute: '/inventory',
//     Icon: InventoryIcon,
//     hideOnGuard: true,
//     useGuard: useHasBenchmarkCheck,
//     children: [
//       {
//         Icon: SearchIcon,
//         name: <Trans>Search</Trans>,
//         // TODO: /inventory/search
//         route: '/inventory/search',
//       },
//       {
//         Icon: HistoryIcon,
//         name: <Trans>History</Trans>,
//         route: '/inventory/history',
//       },
//     ],
//   },
//   {
//     name: <Trans>Security</Trans>,
//     route: '/security',
//     Icon: SecurityIcon,
//   },
// ]

// export const bottomMenuList: MenuListItem[] = [
//   {
//     name: <Trans>Workspace Settings</Trans>,
//     route: '/workspace-settings',
//     Icon: RoomPreferencesIcon,
//     useGuard: () => usePermissionCheck('readSettings'),
//     hideOnGuard: true,
//     children: [
//       {
//         Icon: CloudIcon,
//         name: <Trans>Accounts</Trans>,
//         route: '/workspace-settings/accounts',
//       },
//       {
//         Icon: PeopleIcon,
//         name: <Trans>Users</Trans>,
//         route: '/workspace-settings/users',
//       },
//       {
//         Icon: ReceiptIcon,
//         name: <Trans>Billing</Trans>,
//         route: '/workspace-settings/billing-receipts',
//         hideOnGuard: true,
//         useGuard: () => usePermissionCheck('readBilling'),
//       },
//       // {
//       //   Icon: FolderCopyIcon,
//       //   name: <Trans>External Directories</Trans>,
//       //   route: '/workspace-settings/external-directories',
//       // },
//     ],
//   },
// ]
