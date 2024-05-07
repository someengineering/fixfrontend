import { t } from '@lingui/macro'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, Button, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'

const pathnameToTitle = (pathname: string) => {
  switch (pathname) {
    case '/workspace-settings':
      return t`Workspace Settings`
    case '/workspace-settings/accounts':
      return t`Accounts`
    case '/workspace-settings/accounts/setup-cloud':
      return t`Cloud Setup`
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

export const PanelBreadcrumbs = () => {
  const { pathname: path } = useLocation()
  const navigate = useAbsoluteNavigate()
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
  return paths.length ? (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
      {paths.map(({ title, to }, i) => (
        <Button key={i} onClick={() => navigate(to)}>
          {title}
        </Button>
      ))}
      <Typography color="text.primary">{lastTitle}</Typography>
    </Breadcrumbs>
  ) : null
}
