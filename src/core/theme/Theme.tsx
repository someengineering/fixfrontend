import { createTheme, CssBaseline, PaletteOptions, responsiveFontSizes, ThemeOptions, ThemeProvider, useMediaQuery } from '@mui/material'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'

import '@fontsource-variable/nunito-sans'
import { useLingui } from '@lingui/react'
import { langs } from 'src/shared/constants'
import { getThemeMode, setThemeMode } from 'src/shared/utils/localstorage'
import { ThemeContext } from './ThemeContext'

createTheme({
  typography: {},
})

export type ThemeProps = PropsWithChildren

const themeMode = getThemeMode()

export function Theme({ children }: ThemeProps) {
  const {
    i18n: { locale },
  } = useLingui()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(themeMode?.mode ?? (prefersDarkMode ? 'dark' : 'light'))
  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }, [])
  useEffect(() => {
    setThemeMode({ mode })
  }, [mode])
  const palette: PaletteOptions = useMemo(
    () => ({
      primary: {
        main: mode === 'dark' ? '#648DE5' : '#1C4396',
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
    'Nunito Sans Variable',
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
        MuiCssBaseline: {
          styleOverrides: {
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
          },
        },
      },
    },
    ...(langs.find((i) => i.locale === locale)?.muiLocale ?? []),
  )

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={responsiveFontSizes(theme)}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
