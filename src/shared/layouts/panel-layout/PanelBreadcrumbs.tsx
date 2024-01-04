import { t } from '@lingui/macro'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, Button, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'

const pathnameToTitle = (pathname: string) => {
  switch (pathname) {
    case '/workspace-settings':
      return t`Workspace Settings`
    case '/workspace-settings/users':
      return t`Workspace Users`
    case '/workspace-settings/users/invitations':
      return t`Pending Invitations`
    case '/workspace-settings/billing-receipts':
      return t`Billing & Receipts`
    case '/workspace-settings/external-directories':
      return t`External Directories`
    default:
      return pathname.split('/').slice(-1)[0]
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
        return [...prev, { title: pathnameToTitle(to), to }]
      },
      [] as { title: string; to: string }[],
    )
  const lastTitle = paths.splice(-1, 1)[0].title
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
