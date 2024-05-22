import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { LoadingButton } from '@mui/lab'
import { Button, ButtonBase, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { FormEvent, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
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
}: WorkspaceSettingsFormItemProps) => {
  const { checkPermission } = useUserProfile()
  const hasUpdateSettingsPermission = checkPermission('updateSettings')
  const [inputValue, setInputValue] = useState(value)
  const [focused, setFocused] = useState(false)

  const focusedInputRef = useRef<HTMLInputElement>(null)

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
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      width={{ xs: '100%', sm: undefined }}
      spacing={1}
      alignItems={{ xs: 'end', sm: 'center' }}
      component={readonly ? 'div' : 'form'}
      onSubmit={readonly ? undefined : handleSubmit}
    >
      <Typography width={{ xs: '100%', sm: 150 }}>{label}</Typography>
      <Stack width={{ xs: '100%', sm: 400 }}>
        {!hasUpdateSettingsPermission ? (
          <Typography
            component={readonly ? Stack : 'p'}
            fontFamily={readonly ? 'monospace' : undefined}
            border={({ palette }) => `1px solid ${palette.primary.main}`}
            borderRadius={1}
            p={1}
            direction={readonly ? 'row' : undefined}
            justifyContent={readonly ? 'space-between' : undefined}
            alignItems={readonly ? 'center' : undefined}
          >
            {hide && !focused ? value.replace(/[\da-zA-Z]/g, '*') : value}
            {hide ? (
              <ButtonBase onClick={() => setFocused((prevFocused) => !prevFocused)}>
                {focused ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </ButtonBase>
            ) : null}
          </Typography>
        ) : readonly ? (
          <TextField
            size="small"
            value={hide && !focused ? value.replace(/[\da-zA-Z]/g, '*') : value}
            focused={hide ? focused : undefined}
            onFocus={hide ? () => setFocused(true) : undefined}
            onBlur={hide ? () => setFocused(false) : undefined}
            aria-readonly="true"
            InputProps={{
              readOnly: true,
              ref: focusedInputRef,
            }}
          />
        ) : (
          <TextField
            placeholder={value}
            value={inputValue}
            size="small"
            onChange={readonly ? undefined : (e) => setInputValue(e.target.value)}
          />
        )}
      </Stack>
      {noDisabledPermission ? (
        <LoadingButton
          variant="contained"
          type={readonly ? 'button' : 'submit'}
          onClick={readonly ? () => onSubmit(inputValue) : undefined}
          disabled={(!noDisabledPermission && !hasUpdateSettingsPermission) || (!readonly && inputValue === value)}
          loading={isPending}
        >
          {buttonName}
        </LoadingButton>
      ) : hasUpdateSettingsPermission ? (
        <LoadingButton
          variant="contained"
          type={readonly ? 'button' : 'submit'}
          onClick={readonly ? () => onSubmit(inputValue) : undefined}
          disabled={!hasUpdateSettingsPermission || (!readonly && inputValue === value)}
          loading={isPending}
        >
          {buttonName}
        </LoadingButton>
      ) : null}
    </Stack>
  )
}
