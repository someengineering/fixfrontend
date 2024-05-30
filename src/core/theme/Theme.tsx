// eslint-disable-next-line no-restricted-imports
import { CacheProvider, EmotionCache } from '@emotion/react'
import '@fontsource-variable/plus-jakarta-sans'
import { useLingui } from '@lingui/react'
import {
  CssBaseline,
  PaletteOptions,
  ThemeOptions,
  ThemeProvider,
  alpha,
  createTheme,
  responsiveFontSizes,
  useMediaQuery,
} from '@mui/material'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { langs } from 'src/shared/constants'
import { getThemeMode, setThemeMode } from 'src/shared/utils/localstorage'
import { ThemeContext } from './ThemeContext'

createTheme({
  typography: {},
})

export type ThemeProps = PropsWithChildren<{ emotionCache?: EmotionCache }>

const themeMode = getThemeMode()

export function Theme({ children, emotionCache }: ThemeProps) {
  const {
    i18n: { locale },
  } = useLingui()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(themeMode?.mode ?? (prefersDarkMode ? 'dark' : 'light'))
  const toggleColorMode = useCallback((themeMode?: 'light' | 'dark') => {
    setMode((prevMode) => themeMode ?? (prevMode === 'light' ? 'dark' : 'light'))
  }, [])
  useEffect(() => {
    setThemeMode({ mode })
  }, [mode])
  const palette: PaletteOptions = useMemo(
    () => ({
      primary: {
        main: mode === 'dark' ? '#648DE5' : '#3d58d3',
      },
      secondary: {
        main: '#B1C8FA',
      },
      error: {
        main: '#E01A4F',
      },
      warning: {
        main: '#F78400',
      },
      success: {
        main: '#00AC6B',
      },
      background: { default: mode === 'dark' ? '#242424' : '#FFFFFF' },
      common:
        mode === 'dark'
          ? {
              black: '#FFFFFF',
              white: '#242424',
            }
          : {
              white: '#FFFFFF',
              black: '#242424',
            },
      mode,
    }),
    [mode],
  )

  const fontFamily = [
    '"Plus Jakarta Sans Variable"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(',')

  const typography: ThemeOptions['typography'] = {
    fontFamily,
    h1: { fontSize: '55px', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-2.75px' },
    h2: { fontSize: '40px', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-2px' },
    h3: { fontSize: '30px', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-1.5px' },
    h4: { fontSize: '25px', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-1.25px' },
    h5: { fontSize: '20px', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-1px' },
    h6: { fontSize: '18px', fontWeight: 500, lineHeight: 1.15 },
    body1: { fontSize: '16px', fontWeight: 400, lineHeight: 1.15 },
    body2: { fontSize: '14px', fontWeight: 400, lineHeight: 1.15 },
    caption: { fontSize: '13px', fontWeight: 300, lineHeight: 1.15 },
    subtitle1: { fontSize: '12px', fontWeight: 300, lineHeight: 1.15 },
    button: {
      fontSize: '14px',
      fontWeight: 600,
      fontFamily,
    },
  }

  const theme = createTheme(
    {
      palette,
      typography,
      spacing: 8,
      transitions: {
        duration: {
          long: 500,
          longer: 1000,
          longest: 2000,
        },
      },
      components: {
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              background: palette.background?.default,
              color: palette.common?.black,
              fontSize: 14,
              boxShadow:
                'rgba(0, 0, 0, 0.2) 0px 11px 15px -7px, rgba(0, 0, 0, 0.14) 0px 24px 38px 3px, rgba(0, 0, 0, 0.12) 0px 9px 46px 8px',
            },
            arrow: {
              color: palette.background?.default,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
          },
        },
        MuiBackdrop: {
          styleOverrides: {
            root: {
              backgroundColor: alpha('#000', 0.7),
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              scrollBehavior: 'smooth',
            },
            'body > #root': {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
              minHeight: '100vh',
              width: '100%',
              margin: 0,
              padding: 0,
            },
            code: {
              fontFamily: 'monospace',
            },
          },
        },
      },
    },
    ...(langs[locale as keyof typeof langs]?.muiLocale ?? []),
  )

  const themeContainer = (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={responsiveFontSizes(theme)}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )

  return emotionCache ? <CacheProvider value={emotionCache}>{themeContainer}</CacheProvider> : themeContainer
}
