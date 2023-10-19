import {
  Alert,
  AlertColor,
  AlertProps as MuiAlertProps,
  Snackbar as MuiSnackbar,
  SnackbarProps as MuiSnackbarProps,
  Slide,
  SnackbarOrigin,
  styled,
} from '@mui/material'
import { PropsWithChildren, SyntheticEvent, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

interface SnackbarOptions {
  snackbarProps: Omit<MuiSnackbarProps, 'open' | 'onClose' | 'autoHideDuration' | 'anchorOrigin'>
  alertProps: Omit<MuiAlertProps, 'onClose' | 'severity'>
  severity: AlertColor
  autoHideDuration: number | null
  anchorOrigin: SnackbarOrigin
}

const DEFAULT_SNACKBAR_OPTIONS: SnackbarOptions = {
  snackbarProps: {},
  alertProps: {},
  severity: 'info',
  autoHideDuration: panelUI.snackbarAutoHideDuration,
  anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
}

export interface SnackbarValue {
  open: boolean
  message: string
  options: SnackbarOptions
}

export interface SnackbarContextValue {
  showSnackbar: (message: string, options?: Partial<SnackbarOptions>) => Promise<number>
  closeSnackbar: (key: number) => Promise<boolean>
}
export const SnackbarContext = createContext<SnackbarContextValue | null>(null)

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used inside the SnackbarProvider')
  }
  return context
}

export interface SnackbarProviderProps {}

const Snackbar = styled(MuiSnackbar, { shouldForwardProp: shouldForwardPropWithBlackList(['index']) })<{ index: number }>(
  ({ theme, index }) => ({
    marginBottom: 54 * index,
    transition: theme.transitions.create(['margin-bottom', 'transform'], { duration: 225, delay: 0, easing: 'cubic-bezier(0, 0, 0.2, 1)' }),
  }),
)

export function SnackbarElement({
  id,
  message,
  open,
  options,
  index,
  closeSnackbar,
}: SnackbarValue & {
  id: number
  index: number
  closeSnackbar: (id: number) => void
}) {
  const handleClose = useCallback(
    (_?: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }
      closeSnackbar(id)
    },
    [closeSnackbar, id],
  )
  return (
    <Snackbar
      {...options.snackbarProps}
      index={index}
      open={open}
      TransitionComponent={Slide}
      autoHideDuration={options?.autoHideDuration}
      onClose={handleClose}
      anchorOrigin={options?.anchorOrigin}
    >
      <Alert {...(options?.alertProps ?? {})} onClose={handleClose} severity={options?.severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export function SnackbarProvider({ children }: PropsWithChildren<SnackbarProviderProps>) {
  const [snackbars, setSnackbars] = useState<{ [key in number]: SnackbarValue }>({})

  const closeSnackbar = useCallback((key: number) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        setSnackbars((prev) => {
          const newSnackBars = { ...prev }
          if (newSnackBars[key]) {
            delete newSnackBars[key]
            resolve(true)
            return newSnackBars
          }
          setTimeout(() => {
            resolve(false)
          })
          return prev
        })
      }, 300)
      setSnackbars((prev) => (prev[key] ? { ...prev, [key]: { ...prev[key], open: false } } : prev))
    })
  }, [])

  const handleShow = useCallback(
    (
      message: string,
      {
        alertProps = { ...DEFAULT_SNACKBAR_OPTIONS.alertProps },
        anchorOrigin = { ...DEFAULT_SNACKBAR_OPTIONS.anchorOrigin },
        autoHideDuration = DEFAULT_SNACKBAR_OPTIONS.autoHideDuration,
        severity = DEFAULT_SNACKBAR_OPTIONS.severity,
        snackbarProps = { ...DEFAULT_SNACKBAR_OPTIONS.snackbarProps },
      }: Partial<SnackbarOptions> = {
        ...DEFAULT_SNACKBAR_OPTIONS,
        alertProps: { ...DEFAULT_SNACKBAR_OPTIONS.alertProps },
        anchorOrigin: { ...DEFAULT_SNACKBAR_OPTIONS.anchorOrigin },
        snackbarProps: { ...DEFAULT_SNACKBAR_OPTIONS.snackbarProps },
      },
    ) => {
      return new Promise<number>((resolve) => {
        setSnackbars((prev) => {
          const keys = Object.keys(prev)
          const id = ((keys.length && Number(keys[keys.length - 1])) ?? -1) + 1
          resolve(id)
          return {
            ...prev,
            [id]: {
              open: true,
              message,
              options: {
                alertProps,
                anchorOrigin,
                autoHideDuration,
                severity,
                snackbarProps,
              },
            },
          }
        })
      })
    },
    [],
  )

  const providerValue = useMemo(() => ({ showSnackbar: handleShow, closeSnackbar }), [closeSnackbar, handleShow])

  return (
    <SnackbarContext.Provider value={providerValue}>
      {children}
      {Object.entries(snackbars).map(([id, { open, message, options }], i) => (
        <SnackbarElement id={Number(id)} open={open} message={message} options={options} key={id} closeSnackbar={closeSnackbar} index={i} />
      ))}
    </SnackbarContext.Provider>
  )
}
