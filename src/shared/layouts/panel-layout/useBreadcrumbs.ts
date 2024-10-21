import { t } from '@lingui/macro'
import { useLocation } from 'react-router-dom'

const pathnameToTitle = (pathname: string) => {
  switch (pathname) {
    case '/settings/workspace':
      return t`Workspace Settings`
    case '/accounts':
      return t`Cloud Accounts`
    case '/accounts/setup-cloud/aws':
      return t`AWS Account Setup`
    case '/accounts/setup-cloud/gcp':
      return t`GCP Account Setup`
    case '/accounts/setup-cloud/azure':
      return t`Azure Account Setup`
    case '/settings/workspace/users':
      return t`User Invitations`
    case '/settings/workspace/users/pending-invitations':
      return t`Pending Invitations`
    case '/settings/workspace/billing-receipts':
      return t`Billing`
    case '/settings/workspace/external-directories':
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
        return [...prev, { title, to }]
      },
      [] as { title?: string; to: string }[],
    )
    .filter((i) => i.title)
  const lastTitle = paths.splice(-1, 1)[0]?.title

  return { paths, lastTitle }
}
