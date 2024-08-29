import { Breadcrumbs, breadcrumbsClasses, Button, IconButton, Typography } from '@mui/material'
import { DoubleArrowIcon, HomeIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { PanelToolbar } from './PanelToolbar'
import { useBreadcrumbs } from './useBreadcrumbs'

export const PanelBreadcrumbs = () => {
  const { paths, lastTitle } = useBreadcrumbs()
  const navigate = useAbsoluteNavigate()
  return paths.length ? (
    <PanelToolbar sx={{ minHeight: '0!important', height: 'auto!important' }}>
      <Breadcrumbs
        separator={<DoubleArrowIcon height={12} width={12} />}
        sx={{ pb: 0, flexShrink: 0, height: 54, display: 'flex', [`.${breadcrumbsClasses.separator}`]: { m: 0 } }}
      >
        {paths.map(({ title, to }, i) =>
          to === panelUI.homePage ? (
            <IconButton
              key={i}
              href={to}
              onClick={(e) => {
                e.preventDefault()
                navigate(to)
              }}
              sx={{ p: 1 }}
            >
              <HomeIcon />
            </IconButton>
          ) : (
            <Button
              key={i}
              href={to}
              onClick={(e) => {
                e.preventDefault()
                navigate(to)
              }}
              sx={{ p: 1 }}
            >
              {title}
            </Button>
          ),
        )}
        <Typography
          variant="button"
          textTransform="none"
          color="text.primary"
          p={1}
          fontWeight={700}
          lineHeight={1.26}
          justifyContent="center"
          display="flex"
        >
          {lastTitle}
        </Typography>
      </Breadcrumbs>
    </PanelToolbar>
  ) : null
}
