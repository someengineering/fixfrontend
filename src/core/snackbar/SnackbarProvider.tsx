import {
  Alert,
  AlertColor,
  AlertProps as MuiAlertProps,
  Snackbar as MuiSnackbar,
  SnackbarProps as MuiSnackbarProps,
  Slide,
  SnackbarOrigin,
  styled,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material'
import { createContext, PropsWithChildren, ReactNode, SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

interface SnackbarOptions {
  snackbarProps: Omit<MuiSnackbarProps, 'open' | 'onClose' | 'autoHideDuration' | 'anchorOrigin'>
  alertProps: Omit<MuiAlertProps, 'onClose' | 'severity'>
  autoHideDuration: number | null
  typographyProps: TypographyProps
  alertColor: AlertColor | undefined
  bgcolor: TypographyProps['color']
  textColor: TypographyProps['color']
  anchorOrigin: SnackbarOrigin
}

const DEFAULT_SNACKBAR_OPTIONS: SnackbarOptions = {
  snackbarProps: {},
  typographyProps: {},
  alertProps: {},
  alertColor: undefined,
  bgcolor: panelUI.uiThemePalette.accent.darkGray,
  textColor: panelUI.uiThemePalette.primary.white,
  autoHideDuration: panelUI.snackbarAutoHideDuration,
  anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
}

export interface SnackbarValue {
  open: boolean
  message: ReactNode
  options: SnackbarOptions
}

export interface SnackbarContextValue {
  showSnackbar: (message: ReactNode, options?: Partial<SnackbarOptions>) => Promise<number>
  closeSnackbar: (key: number) => Promise<boolean>
}
export const SnackbarContext = createContext<SnackbarContextValue | null>(null)

const Snackbar = styled(MuiSnackbar, { shouldForwardProp: shouldForwardPropWithBlackList(['index']) })<{ index: number }>(
  ({ theme, index }) => ({
    marginBottom: 54 * index,
    transition: theme.transitions.create(['margin-bottom', 'transform'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    minHeight: 56,
    width: '100%',
    padding: theme.spacing(2.5),
    bottom: '0!important',
    borderRadius: '6px',
    [theme.breakpoints.down('sm')]: {
      left: '0!important',
      right: '0!important',
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3.75),
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(7.5),
    },
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
      TransitionProps={{}}
      autoHideDuration={options.autoHideDuration}
      onClose={handleClose}
      anchorOrigin={options.anchorOrigin}
      sx={
        options.alertColor
          ? undefined
          : {
              bgcolor: options.bgcolor,
            }
      }
    >
      {options.alertColor ? (
        <Alert
          variant="filled"
          {...(options.alertProps ?? {})}
          sx={{ borderRadius: '6px', color: options.textColor, ...options.alertProps.sx }}
          onClose={handleClose}
          severity={options.alertColor}
        >
          {message}
        </Alert>
      ) : (
        <Typography {...options.typographyProps} color={options.textColor} width="100%" height="100%">
          {message}
        </Typography>
      )}
    </Snackbar>
  )
}

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [snackbars, setSnackbars] = useState<Record<number, SnackbarValue>>({})
  const {
    transitions: {
      duration: { standard: standardDuration },
    },
  } = useTheme()

  const closeSnackbar = useCallback(
    (key: number) => {
      return new Promise<boolean>((resolve) => {
        window.setTimeout(() => {
          setSnackbars((prev) => {
            const newSnackBars = { ...prev }
            if (newSnackBars[key]) {
              delete newSnackBars[key]
              resolve(true)
              return newSnackBars
            }
            window.setTimeout(() => {
              resolve(false)
            })
            return prev
          })
        }, standardDuration)
        setSnackbars((prev) => (prev[key] ? { ...prev, [key]: { ...prev[key], open: false } } : prev))
      })
    },
    [standardDuration],
  )

  const handleShow = useCallback(
    (
      message: ReactNode,
      {
        anchorOrigin = { ...DEFAULT_SNACKBAR_OPTIONS.anchorOrigin },
        autoHideDuration = DEFAULT_SNACKBAR_OPTIONS.autoHideDuration,
        snackbarProps = { ...DEFAULT_SNACKBAR_OPTIONS.snackbarProps },
        alertProps = { ...DEFAULT_SNACKBAR_OPTIONS.alertProps },
        typographyProps = DEFAULT_SNACKBAR_OPTIONS.typographyProps,
        bgcolor = DEFAULT_SNACKBAR_OPTIONS.bgcolor,
        textColor = DEFAULT_SNACKBAR_OPTIONS.textColor,
        alertColor = undefined,
      }: Partial<SnackbarOptions> = {
        ...DEFAULT_SNACKBAR_OPTIONS,
        alertProps: { ...DEFAULT_SNACKBAR_OPTIONS.alertProps },
        anchorOrigin: { ...DEFAULT_SNACKBAR_OPTIONS.anchorOrigin },
        snackbarProps: { ...DEFAULT_SNACKBAR_OPTIONS.snackbarProps },
        typographyProps: { ...DEFAULT_SNACKBAR_OPTIONS.typographyProps },
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
                anchorOrigin,
                autoHideDuration,
                snackbarProps,
                bgcolor,
                textColor,
                typographyProps,
                alertColor,
                alertProps,
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
