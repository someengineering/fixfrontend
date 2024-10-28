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
  menuItemClasses,
  responsiveFontSizes,
  tabClasses,
  tableCellClasses,
} from '@mui/material'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { CancelIcon, CheckIcon, InfoIcon, KeyboardArrowDownIcon, WarningIcon } from 'src/assets/icons'
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
      text: {
        primary: panelUI.uiThemePalette.text.darkGray,
        disabled: panelUI.uiThemePalette.text.disabled,
        secondary: panelUI.uiThemePalette.text.sub,
      },
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
    button: { fontSize: '0.875rem', fontWeight: 500, fontFamily, lineHeight: 1.4286, textTransform: 'none' },
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
          defaultProps: {
            slotProps: {
              input: { sx: { p: 1 } },
            },
          },
          styleOverrides: {
            root: {
              ...typography.subtitle1,
              height: 44,
              borderRadius: '6px !important',
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
        MuiAvatar: {
          styleOverrides: {
            root: {
              width: 32,
              height: 32,
              padding: '2px',
              ...typography.linkBold,
              textDecoration: 'none',
            },
          },
        },
        MuiTypography: {
          defaultProps: {
            variantMapping: {
              bodyBiggest: 'p',
              bodyBigger: 'p',
              bodyBig: 'p',
              buttonSmall: 'p',
              buttonLarge: 'p',
              subMenu: 'li',
              linkBold: 'a',
            },
          },
        },
        MuiAlert: {
          defaultProps: {
            iconMapping: {
              error: <CancelIcon color={panelUI.uiThemePalette.primary.white} />,
              success: <CheckIcon color={panelUI.uiThemePalette.primary.white} />,
              warning: <WarningIcon color={panelUI.uiThemePalette.primary.white} />,
              info: <InfoIcon color={panelUI.uiThemePalette.primary.white} />,
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              background: palette.text?.primary,
              color: palette.common?.white,
              padding: 8,
              fontSize: 12,
              fontWeight: 500,
              boxShadow:
                'rgba(0, 0, 0, 0.2) 0px 11px 15px -7px, rgba(0, 0, 0, 0.14) 0px 24px 38px 3px, rgba(0, 0, 0, 0.12) 0px 9px 46px 8px',
            },
            arrow: {
              color: palette.text?.primary,
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
          defaultProps: {
            disableRipple: true,
            disableFocusRipple: true,
            disableTouchRipple: true,
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '6px',
            },
            sizeLarge: {
              ...typography.buttonLarge,
              padding: '12px',
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
              [`&.${buttonClasses.colorPrimary}`]: {
                borderColor: panelUI.uiThemePalette.input.border,
                ':hover,:focus,:active': {
                  borderColor: panelUI.uiThemePalette.text.sub,
                  backgroundColor: panelUI.uiThemePalette.background.bgPurple,
                },
              },
            },
            contained: {
              color: panelUI.uiThemePalette.primary.white,
              [`&.${buttonClasses.colorPrimary}`]: {
                ':hover,:focus,:active': {
                  backgroundColor: panelUI.uiThemePalette.primary.darkPurple,
                },
              },
              boxShadow: 'none !important',
            },
            textSecondary: {
              backgroundColor: panelUI.uiThemePalette.background.bgPurple,
              ':hover,:focus,:active': {
                backgroundColor: panelUI.uiThemePalette.accent.purple,
                color: panelUI.uiThemePalette.primary.white,
              },
              color: panelUI.uiThemePalette.text.sub,
            },
            textPrimary: {
              ':hover,:focus,:active': {
                backgroundColor: panelUI.uiThemePalette.background.bgPurple,
              },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              marginBottom: '12px',
            },
            indicator: {
              display: 'none',
            },
            flexContainer: {
              gap: '8px',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              color: panelUI.uiThemePalette.text.sub,
              transition: orgTheme.transitions.create('background-color'),
              [`&.${tabClasses.selected}`]: {
                backgroundColor: panelUI.uiThemePalette.background.bgPurple,
                color: panelUI.uiThemePalette.accent.purple,
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: panelUI.uiThemePalette.primary.white,
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderColor: panelUI.uiThemePalette.primary.divider,
              backgroundColor: panelUI.uiThemePalette.primary.white,
              ...typography.subtitle1,
            },
            head: {
              color: panelUI.uiThemePalette.text.sub,
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:last-child': {
                [`& .${tableCellClasses.body}`]: {
                  border: 'none',
                },
              },
            },
          },
        },
        MuiSelect: {
          defaultProps: {
            IconComponent: KeyboardArrowDownIcon,
          },
          styleOverrides: {
            root: {
              fieldset: {
                borderRadius: '6px',
                border: `1px solid ${panelUI.uiThemePalette.input.border}`,
                ':hover': {
                  border: `1px solid ${panelUI.uiThemePalette.text.sub}`,
                },
              },
            },
            select: {
              padding: '11px 55px 11px 12px',
            },
            icon: {
              top: 'initial',
              right: '6px',
            },
          },
        },
        MuiMenu: {
          defaultProps: {
            slotProps: {
              paper: {
                sx: {
                  borderRadius: '12px',
                },
              },
            },
          },
        },
        MuiList: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              padding: '16px',
            },
          },
        },
        MuiMenuItem: {
          defaultProps: {
            sx: {
              [`.${menuItemClasses.selected}`]: {
                backgroundColor: panelUI.uiThemePalette.background.bgPurple,
                color: panelUI.uiThemePalette.primary.purple,
              },
            },
          },
          styleOverrides: {
            root: {
              padding: '8px 12px',
              borderRadius: '6px',
            },
          },
        },
        MuiBackdrop: {
          styleOverrides: {
            root: {
              backgroundColor: 'transparent',
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
