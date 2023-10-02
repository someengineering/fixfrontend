import { Box, createTheme, CssBaseline, PaletteOptions, responsiveFontSizes, ThemeOptions, ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'

import '@fontsource-variable/nunito-sans'

createTheme({
  typography: {},
})

export type ThemeProps = PropsWithChildren<{}>

export function Theme({ children }: ThemeProps) {
  const palette: PaletteOptions = {
    primary: {
      main: '#1C4396',
    },
    secondary: {
      main: '#648DE5',
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
    background: { default: '#FFFFFF' },
  }

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

  const theme = createTheme({
    palette,
    typography,
    spacing: 8,
  })

  return (
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <CssBaseline enableColorScheme />
      <Box maxHeight="100%">{children}</Box>
    </ThemeProvider>
  )
}
