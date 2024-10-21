import { Box, Divider, Stack, Typography } from '@mui/material'
import { PropsWithChildren, useContext, useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { CheckSmallIcon } from 'src/assets/icons'
import { InternalLinkButton } from 'src/shared/link-button'
import { ButtonsRegionContext } from './ButtonsRegion'
import { MenuListItem, settingsMenu } from './settingsMenuList'

const useMapRouteToSettingDetails = () => {
  const location = useLocation()
  return useMemo(() => {
    const found = settingsMenu.find((item) => !!matchPath(`${item.route}/*`, location.pathname))
    const current = found?.list.find((item) => !!matchPath(item.route, location.pathname))
    return found && current ? { ...found, currentRoute: current.route, currentTitle: current.name } : undefined
  }, [location])
}

interface PanelSettingsMenuListItemProps extends MenuListItem {
  isCurrent: boolean
}

const PanelSettingsMenuListItem = ({ isCurrent, name, route }: PanelSettingsMenuListItemProps) => {
  return (
    <Stack
      direction="row"
      p={1}
      spacing={1}
      bgcolor={isCurrent ? 'background.default' : undefined}
      borderRadius="6px"
      component={InternalLinkButton}
      to={route}
      alignItems="center"
    >
      <Typography
        variant="subtitle1"
        fontWeight={500}
        color={isCurrent ? 'primary.main' : 'textSecondary'}
        flex={1}
        whiteSpace="nowrap"
        textAlign="left"
      >
        {name}
      </Typography>
      {isCurrent ? <CheckSmallIcon color="primary.main" /> : <Box width={24} height={24} />}
    </Stack>
  )
}

export const PanelSettingsContent = ({ children }: PropsWithChildren) => {
  const { content } = useContext(ButtonsRegionContext)
  const menu = useMapRouteToSettingDetails()
  return (
    <>
      {menu ? (
        <Stack flex={0} height="100%">
          <Box py={3} px={3.75}>
            <Typography variant="h4">{menu.title}</Typography>
          </Box>
          <Divider />
          <Stack flex={1} p={2.5} spacing={0.5} overflow="auto">
            {menu.list.map((item, i) => (
              <PanelSettingsMenuListItem key={i} {...item} isCurrent={menu.currentRoute === item.route} />
            ))}
          </Stack>
        </Stack>
      ) : null}
      <Divider orientation="vertical" />
      <Stack height="100%" flex={1} py={3.75} px={3.75} spacing={3} overflow="auto">
        <Stack border={({ palette }) => `1px solid ${palette.divider}`} borderRadius="16px">
          {menu ? (
            <Stack direction="row" alignItems="center" justifyContent="space-between" py={3} px={3.75}>
              <Typography variant="h4">{menu.currentTitle}</Typography>
              <Stack direction="row" spacing={1}>
                {content}
              </Stack>
            </Stack>
          ) : null}
          <Divider flexItem />
          <Stack p={3.75}>{children}</Stack>
        </Stack>
      </Stack>
    </>
  )
}
