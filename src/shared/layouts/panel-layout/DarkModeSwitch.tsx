import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Box, Divider, Switch } from '@mui/material'
import { useThemeMode } from 'src/core/theme/ThemeContext'

export const DarkModeSwitch = () => {
  const { toggleColorMode, mode } = useThemeMode()
  const isDark = mode === 'dark'
  return (
    <Box display="flex" justifyContent="center" alignItems="center" px={2}>
      <Divider orientation="vertical" />
      <Switch checked={isDark} onChange={toggleColorMode} sx={{ mx: 1 }} />
      {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      <Divider orientation="vertical" sx={{ ml: 1 }} />
    </Box>
  )
}
