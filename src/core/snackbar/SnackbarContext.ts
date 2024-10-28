import { AlertColor, AlertProps as MuiAlertProps, SnackbarProps as MuiSnackbarProps, SnackbarOrigin, TypographyProps } from '@mui/material'
import { createContext, ReactNode } from 'react'

export interface SnackbarOptions {
  snackbarProps: Omit<MuiSnackbarProps, 'open' | 'onClose' | 'autoHideDuration' | 'anchorOrigin'>
  alertProps: Omit<MuiAlertProps, 'onClose' | 'severity'>
  autoHideDuration: number | null
  typographyProps: TypographyProps
  alertColor: AlertColor | undefined
  bgcolor: TypographyProps['color']
  textColor: TypographyProps['color']
  anchorOrigin: SnackbarOrigin
}

export interface SnackbarContextValue {
  showSnackbar: (message: ReactNode, options?: Partial<SnackbarOptions>) => Promise<number>
  closeSnackbar: (key: number) => Promise<boolean>
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null)
