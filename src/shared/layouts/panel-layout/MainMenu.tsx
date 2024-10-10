import { Button, Stack, Typography } from '@mui/material'
import { useMatch } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { mainMenuList, MenuListItem } from './menuList'

const MenuItem = ({ menuItem: { Icon, name, route, exact } }: { menuItem: MenuListItem }) => {
  const mainMatch = useMatch({ path: exact ? route : `${route}/*` })
  const hasMatch = !!mainMatch
  const navigate = useAbsoluteNavigate()
  return (
    <Stack
      direction="row"
      height="100%"
      borderBottom={hasMatch ? `2px solid ${panelUI.uiThemePalette.accent.purple}` : undefined}
      pt={hasMatch ? '2px' : undefined}
    >
      <Button onClick={() => navigate({ pathname: route })} color="primary" sx={{ width: '100%', height: '100%', p: 1.5, borderRadius: 0 }}>
        <Icon color={hasMatch ? panelUI.uiThemePalette.accent.purple : panelUI.uiThemePalette.accent.darkGray} />
        <Typography variant="button" color={hasMatch ? panelUI.uiThemePalette.accent.purple : panelUI.uiThemePalette.accent.darkGray}>
          {name}
        </Typography>
      </Button>
    </Stack>
  )
}

export const MainMenu = () => {
  return (
    <Stack direction="row" spacing={1} height="100%" alignItems="center">
      {mainMenuList.map((menuItem, i) => (
        <MenuItem key={i} menuItem={menuItem} />
      ))}
    </Stack>
  )
}
