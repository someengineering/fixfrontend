import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Box, Divider, IconButton, Switch, styled } from '@mui/material'
import { useThemeMode } from 'src/core/theme/ThemeContext'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

const DarkModeIconButton = styled(IconButton, { shouldForwardProp: shouldForwardPropWithBlackList(['whiteMode']) })<{ whiteMode: boolean }>(
  ({ theme, whiteMode }) => ({
    padding: 0,
    color: whiteMode && theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.primary.main,
  }),
)

export const DarkModeSwitch = ({ hideSwitch, whiteMode }: { hideSwitch?: boolean; whiteMode?: boolean }) => {
  const { toggleColorMode, mode } = useThemeMode()
  const isDark = mode === 'dark'
  return (
    <Box display="flex" justifyContent="center" alignItems="center" px={2}>
      {!hideSwitch ? <Divider orientation="vertical" /> : null}
      {!hideSwitch ? <Switch checked={isDark} onChange={toggleColorMode} sx={{ mx: 1 }} /> : null}
      <DarkModeIconButton onClick={toggleColorMode} whiteMode={whiteMode ?? false}>
        {isDark ? (
          <Brightness7Icon fontSize={hideSwitch ? 'large' : undefined} />
        ) : (
          <Brightness4Icon fontSize={hideSwitch ? 'large' : undefined} />
        )}
      </DarkModeIconButton>
      {!hideSwitch ? <Divider orientation="vertical" sx={{ ml: 1 }} /> : null}
    </Box>
  )
}
