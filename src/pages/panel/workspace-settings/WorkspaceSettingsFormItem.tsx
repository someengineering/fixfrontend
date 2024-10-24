import { LoadingButton } from '@mui/lab'
import { Box, Button, ButtonBase, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { FormEvent, MutableRefObject, ReactNode, useEffect, useState } from 'react'
import { VisibilityIcon, VisibilityOffIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'

interface WorkspaceSettingsFormItemProps {
  label: ReactNode
  buttonName: ReactNode
  value: string
  isPending?: boolean
  isLoading: boolean
  onSubmit: (value: string) => void
  readonly?: boolean
  hide?: boolean
  focusedRef?: MutableRefObject<((focused: boolean) => void) | undefined>
  noDisabledPermission?: boolean
  buttonStartIcon?: ReactNode
}

export const WorkspaceSettingsFormItem = ({
  isLoading,
  label,
  isPending,
  onSubmit,
  readonly,
  value,
  buttonName,
  hide,
  focusedRef,
  noDisabledPermission,
  buttonStartIcon,
}: WorkspaceSettingsFormItemProps) => {
  const { checkPermission } = useUserProfile()
  const hasUpdateSettingsPermission = checkPermission('updateSettings')
  const [inputValue, setInputValue] = useState(value)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (focusedRef) {
      focusedRef.current = (value: boolean) => {
        if (value) {
          setFocused(true)
          let eventClosed = false
          const clickEventListener = (e: MouseEvent) => {
            if (e.target !== window.document.activeElement) {
              window.removeEventListener('click', clickEventListener)
              eventClosed = true
              setFocused(false)
            }
          }
          window.addEventListener('click', clickEventListener)
          return () => {
            if (!eventClosed) {
              window.removeEventListener('click', clickEventListener)
            }
          }
        } else {
          setFocused(false)
        }
      }
    }
  }, [focusedRef])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(inputValue)
  }

  return isLoading ? (
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={1}>
      <Typography width={150}>{label}</Typography>
      <Skeleton>
        <Stack width={400}>
          <TextField />
        </Stack>
      </Skeleton>
      <Button variant="contained" type="submit" disabled>
        {buttonName}
      </Button>
    </Stack>
  ) : (
    <Stack width="100%" maxWidth={768} spacing={1} component={readonly ? 'div' : 'form'} onSubmit={readonly ? undefined : handleSubmit}>
      <Typography variant="subtitle1" fontWeight={700} color="textSecondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Box flex={1}>
          {!hasUpdateSettingsPermission || readonly ? (
            <Typography
              component={readonly ? Stack : 'p'}
              border={({ palette }) => `1px solid ${palette.divider}`}
              borderRadius="6px"
              py={1.625}
              px={2}
              variant="body2"
              direction={readonly ? 'row' : undefined}
              justifyContent={readonly ? 'space-between' : undefined}
              alignItems={readonly ? 'center' : undefined}
              bgcolor="background.paper"
              width="100%"
            >
              {hide && !focused ? value.replace(/[\da-zA-Z]/g, '*') : value}
              {hide ? (
                <ButtonBase onClick={() => setFocused((prevFocused) => !prevFocused)}>
                  {focused ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </ButtonBase>
              ) : null}
            </Typography>
          ) : (
            <TextField
              placeholder={value}
              value={inputValue}
              fullWidth
              sx={{
                div: { height: 48 },
                input: {
                  py: 1.625,
                  px: 2,
                },
              }}
              onChange={readonly ? undefined : (e) => setInputValue(e.target.value)}
            />
          )}
        </Box>
        {noDisabledPermission ? (
          <LoadingButton
            sx={{
              minWidth: 142,
            }}
            variant="contained"
            type={readonly ? 'button' : 'submit'}
            onClick={readonly ? () => onSubmit(inputValue) : undefined}
            disabled={(!noDisabledPermission && !hasUpdateSettingsPermission) || (!readonly && inputValue === value)}
            startIcon={buttonStartIcon}
            loading={isPending}
          >
            {buttonName}
          </LoadingButton>
        ) : hasUpdateSettingsPermission ? (
          <LoadingButton
            sx={{
              minWidth: 142,
            }}
            variant="contained"
            type={readonly ? 'button' : 'submit'}
            onClick={readonly ? () => onSubmit(inputValue) : undefined}
            disabled={!hasUpdateSettingsPermission || (!readonly && inputValue === value)}
            startIcon={buttonStartIcon}
            loading={isPending}
          >
            {buttonName}
          </LoadingButton>
        ) : null}
      </Stack>
    </Stack>
  )
}
