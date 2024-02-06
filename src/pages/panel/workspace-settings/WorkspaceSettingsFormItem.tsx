import { LoadingButton } from '@mui/lab'
import { Button, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { FormEvent, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'

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
}: WorkspaceSettingsFormItemProps) => {
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
        {readonly ? (
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
      <LoadingButton
        variant="contained"
        type={readonly ? 'button' : 'submit'}
        onClick={readonly ? () => onSubmit(inputValue) : undefined}
        disabled={!readonly && inputValue === value}
        loading={isPending}
      >
        {buttonName}
      </LoadingButton>
    </Stack>
  )
}
