import { t } from '@lingui/macro'
import {
  AllInclusiveIcon,
  AnalyticsIcon,
  DatabaseIcon,
  DNSIcon,
  FormatListBulletedIcon,
  HomeStorageIcon,
  KeyboardCommandKeyIcon,
  KeyIcon,
  KubernetesIcon,
  ManageAccountIcon,
  MemoryIcon,
  NetworkNodeIcon,
  TroubleshootIcon,
  VerifiedUserIcon,
} from './icon-list'

export const getNameAndIconFromMetadataGroup = (group: string) => {
  switch (group) {
    case 'compute':
      return { name: t`Compute`, Icon: MemoryIcon }
    case 'storage':
      return { name: t`Storage`, Icon: HomeStorageIcon }
    case 'networking':
      return { name: t`Networking`, Icon: NetworkNodeIcon }
    case 'database':
      return { name: t`Database`, Icon: DatabaseIcon }
    case 'analytics':
      return { name: t`Analytics`, Icon: AnalyticsIcon }
    case 'ai':
      return { name: t`Machine Learning & AI`, Icon: KeyboardCommandKeyIcon }
    case 'managed_kubernetes':
      return { name: t`Managed Kubernetes`, Icon: KubernetesIcon }
    case 'dns':
      return { name: t`DNS`, Icon: DNSIcon }
    case 'access_control':
      return { name: t`Access Control`, Icon: KeyIcon }
    case 'management':
      return { name: t`Management`, Icon: ManageAccountIcon }
    case 'security':
      return { name: t`Security`, Icon: VerifiedUserIcon }
    case 'devops':
      return { name: t`DevOps`, Icon: AllInclusiveIcon }
    case 'monitoring':
      return { name: t`Monitoring`, Icon: TroubleshootIcon }
    default:
      return { name: t`Miscellaneous`, Icon: FormatListBulletedIcon }
  }
}
