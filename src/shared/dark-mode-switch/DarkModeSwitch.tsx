import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Box, IconButton, Divider as MuiDivider, styled } from '@mui/material'
import { useThemeMode } from 'src/core/theme/ThemeContext'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

const DarkModeIconButton = styled(IconButton, { shouldForwardProp: shouldForwardPropWithBlackList(['whiteMode']) })<{ whiteMode: boolean }>(
  ({ theme, whiteMode }) => ({
    padding: 0,
    color: whiteMode && theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.primary.main,
  }),
)

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.primary.dark,
}))

export const DarkModeSwitch = ({ hideDivider, whiteMode }: { hideDivider?: boolean; whiteMode?: boolean }) => {
  const { toggleColorMode, mode } = useThemeMode()
  const isDark = mode === 'dark'
  return (
    <Box display="flex" justifyContent="center" alignItems="center" px={2}>
      {!hideDivider ? (
        <Box mr={1} height="100%">
          <Divider orientation="vertical" />
        </Box>
      ) : null}
      <DarkModeIconButton onClick={toggleColorMode} whiteMode={whiteMode ?? false}>
        {isDark ? (
          <Brightness7Icon fontSize={hideDivider ? 'large' : undefined} />
        ) : (
          <Brightness4Icon fontSize={hideDivider ? 'large' : undefined} />
        )}
      </DarkModeIconButton>
      {!hideDivider ? (
        <Box ml={1} height="100%">
          <Divider orientation="vertical" />
        </Box>
      ) : null}
    </Box>
  )
}
