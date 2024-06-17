import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, Button, Typography } from '@mui/material'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { useBreadcrumbs } from './useBreadcrumbs'

export const PanelBreadcrumbs = () => {
  const paths = useBreadcrumbs()
  const navigate = useAbsoluteNavigate()
  const lastTitle = paths.splice(-1, 1)[0]?.title
  return paths.length ? (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ p: 3, pb: 0, flexShrink: 0 }}>
      {paths.map(({ title, to }, i) => (
        <Button
          key={i}
          href={to}
          onClick={(e) => {
            e.preventDefault()
            navigate(to)
          }}
        >
          {title}
        </Button>
      ))}
      <Typography color="text.primary">{lastTitle}</Typography>
    </Breadcrumbs>
  ) : null
}
