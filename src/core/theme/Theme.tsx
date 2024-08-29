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
  buttonClasses,
  createTheme,
  inputBaseClasses,
  responsiveFontSizes,
} from '@mui/material'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { CancelIcon, CheckIcon, InfoIcon, WarningIcon } from 'src/assets/icons'
import { langs, panelUI } from 'src/shared/constants'
import { getThemeMode, setThemeMode } from 'src/shared/utils/localstorage'
import { ThemeContext } from './ThemeContext'

const orgTheme = createTheme({
  typography: {},
})

export type ThemeProps = PropsWithChildren<{ emotionCache?: EmotionCache }>

const themeMode = getThemeMode()

export function Theme({ children, emotionCache }: ThemeProps) {
  const {
    i18n: { locale },
  } = useLingui()
  const prefersDarkMode = false //useMediaQuery('(prefers-color-scheme: dark)')
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
        main: panelUI.uiThemePalette.primary.purple,
        dark: panelUI.uiThemePalette.primary.darkPurple,
        light: panelUI.uiThemePalette.primary.lightPurple,
        contrastText: panelUI.uiThemePalette.primary.white,
      },
      divider: panelUI.uiThemePalette.input.disabled,
      error: {
        main: panelUI.uiThemePalette.severity.error,
        contrastText: panelUI.uiThemePalette.primary.white,
      },
      warning: {
        main: panelUI.uiThemePalette.severity.warning,
        contrastText: panelUI.uiThemePalette.primary.white,
      },
      success: {
        main: panelUI.uiThemePalette.severity.success,
        contrastText: panelUI.uiThemePalette.primary.white,
      },
      info: {
        main: panelUI.uiThemePalette.accent.darkGray,
        contrastText: panelUI.uiThemePalette.primary.white,
      },
      background:
        mode === 'dark'
          ? { default: panelUI.uiThemePalette.accent.darkGray, paper: panelUI.uiThemePalette.accent.gradient }
          : { default: panelUI.uiThemePalette.background.bgPurple, paper: panelUI.uiThemePalette.background.bgGray },
      common:
        mode === 'dark'
          ? {
              black: '#FFFFFF',
              white: '#111827',
            }
          : {
              white: '#FFFFFF',
              black: '#111827',
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
    h1: { fontSize: '3rem', fontWeight: 700, lineHeight: 1.20833 },
    h2: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3125 },
    h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.41667 },
    h5: { fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.4444 },
    h6: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.375 },
    bodyBiggest: { fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.16667 },
    bodyBigger: { fontSize: '1.75rem', fontWeight: 400, lineHeight: 1.21429 },
    bodyBig: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.25 },
    body1: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.44444 },
    body2: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.375 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.28571 },
    subtitle2: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
    button: { fontSize: '0.875rem', fontWeight: 500, fontFamily, lineHeight: 1.4286 },
    subMenu: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.26 },
    buttonLarge: { fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.26 },
    buttonSmall: { fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.26 },
    linkBold: { fontSize: '14px', fontWeight: 700, lineHeight: 1.26, textDecoration: 'underline' },
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
          slideShow: panelUI.slideDuration,
        },
      },
      components: {
        MuiInputBase: {
          styleOverrides: {
            root: {
              ...typography.subtitle1,
              height: 44,
              borderRadius: 6,
              paddingRight: '0 !important',
              transition: orgTheme.transitions.create(['border-color', 'box-shadow', 'fill']),
              '::placeholder': {
                color: panelUI.uiThemePalette.input.hover,
              },
              ':hover,:focus,:active': {
                fieldset: {
                  borderWidth: 1,
                  borderColor: panelUI.uiThemePalette.input.hover,
                },
              },
              [`&.${inputBaseClasses.focused}`]: {
                boxShadow: `0px 0px 0px 6px ${alpha(panelUI.uiThemePalette.primary.purple, 0.2)}`,
                fieldset: {
                  borderWidth: '1px!important',
                  borderColor: panelUI.uiThemePalette.primary.purple,
                },
                svg: {
                  fill: panelUI.uiThemePalette.text.darkGray,
                },
              },

              [`&.${inputBaseClasses.error}`]: {
                backgroundColor: alpha(panelUI.uiThemePalette.severity.error, 0.1),
              },
            },
            input: {
              padding: '8px !important',
            },
            adornedStart: {
              input: {
                paddingLeft: '8px !important',
              },
              svg: {
                fill: panelUI.uiThemePalette.input.hover,
              },
            },
            adornedEnd: {
              input: {
                paddingRight: '8px !important',
              },
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              ...typography.subtitle1,
              color: panelUI.uiThemePalette.text.disabled,
            },
          },
        },
        MuiTypography: {
          defaultProps: {
            variantMapping: {
              bodyBiggest: 'p',
              bodyBigger: 'p',
              bodyBig: 'p',
              buttonSmall: 'button',
              buttonLarge: 'button',
              subMenu: 'li',
              linkBold: 'a',
            },
          },
        },
        MuiAlert: {
          defaultProps: {
            iconMapping: {
              error: <CancelIcon fill={panelUI.uiThemePalette.primary.white} />,
              success: <CheckIcon fill={panelUI.uiThemePalette.primary.white} />,
              warning: <WarningIcon fill={panelUI.uiThemePalette.primary.white} />,
              info: <InfoIcon fill={panelUI.uiThemePalette.primary.white} />,
            },
          },
        },
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
        MuiLink: {
          styleOverrides: {
            root: {
              fontWeight: 700,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '6px',
            },
            sizeMedium: {
              ...typography.buttonLarge,
              padding: '10px 16px',
            },
            sizeSmall: {
              ...typography.buttonSmall,
              padding: '8px 16px',
            },
            outlined: {
              color: panelUI.uiThemePalette.primary.purple,
              borderColor: panelUI.uiThemePalette.primary.divider,
              backgroundColor: panelUI.uiThemePalette.primary.white,
              [`.${buttonClasses.icon} svg`]: {
                fill: panelUI.uiThemePalette.primary.purple,
              },
              ':hover,:focus,:active': {
                backgroundColor: panelUI.uiThemePalette.background.bgPurple,
                borderColor: panelUI.uiThemePalette.text.sub,
              },
            },
            contained: {
              color: panelUI.uiThemePalette.primary.white,
              backgroundColor: panelUI.uiThemePalette.primary.purple,
              ':hover,:focus,:active': { backgroundColor: panelUI.uiThemePalette.primary.darkPurple },
              boxShadow: 'none !important',
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
