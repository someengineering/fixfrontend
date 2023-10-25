import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Box, IconButton, styled } from '@mui/material'
import { useThemeMode } from 'src/core/theme/ThemeContext'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

const DarkModeIconButton = styled(IconButton, { shouldForwardProp: shouldForwardPropWithBlackList(['whiteMode']) })<{ whiteMode: boolean }>(
  ({ theme, whiteMode }) => ({
    padding: 0,
    color: whiteMode && theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.primary.main,
  }),
)

export const DarkModeSwitch = ({ whiteMode }: { whiteMode?: boolean }) => {
  const { toggleColorMode, mode } = useThemeMode()
  const isDark = mode === 'dark'
  return (
    <Box display="flex" justifyContent="center" alignItems="center" px={2}>
      <DarkModeIconButton onClick={toggleColorMode} whiteMode={whiteMode ?? false}>
        {isDark ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
      </DarkModeIconButton>
    </Box>
  )
}
