import { t } from '@lingui/macro'
import { useLocation } from 'react-router-dom'

const pathnameToTitle = (pathname: string) => {
  switch (pathname) {
    case '/workspace-settings':
      return t`Workspace Settings`
    case '/workspace-settings/accounts':
      return t`Accounts`
    case '/workspace-settings/accounts/setup-cloud':
      return t`Cloud Setup`
    case '/workspace-settings/accounts/setup-cloud/aws':
      return t`Amazon Web Services`
    case '/workspace-settings/accounts/setup-cloud/gcp':
      return t`Google Cloud Platform`
    case '/workspace-settings/accounts/setup-cloud/azure':
      return t`Azure`
    case '/workspace-settings/users':
      return t`Users`
    case '/workspace-settings/users/invitations':
      return t`Pending Invitations`
    case '/workspace-settings/billing-receipts':
      return t`Billing`
    case '/workspace-settings/external-directories':
      return t`External Directories`
  }
}

export const useBreadcrumbs = () => {
  const { pathname: path } = useLocation()
  const paths = path
    .split('/')
    .slice(1)
    .reduce(
      (prev, pathname) => {
        const to = `${prev.slice(-1)[0]?.to ?? ''}/${pathname}`
        const title = pathnameToTitle(to)
        return title ? [...prev, { title, to }] : prev
      },
      [] as { title: string; to: string }[],
    )
  const lastTitle = paths.splice(-1, 1)[0]?.title

  return { paths, lastTitle }
}
