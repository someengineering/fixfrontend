import { LoadingButton } from '@mui/lab'
import { Button, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { FormEvent, ReactNode, useEffect, useState } from 'react'

interface WorkspaceSettingsFormProps {
  label: ReactNode
  buttonName: ReactNode
  value: string
  pending?: boolean
  loading: boolean
  onSubmit: (value: string) => void
  readonly?: boolean
}

export const WorkspaceSettingsForm = ({ loading, label, pending, onSubmit, readonly, value, buttonName }: WorkspaceSettingsFormProps) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(inputValue)
  }

  return loading ? (
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
        <TextField
          placeholder={value}
          value={inputValue}
          size="small"
          InputProps={readonly ? { inputComponent: 'span', sx: { py: 1, px: 1.75 } } : undefined}
          inputProps={
            readonly
              ? { children: value, sx: { whiteSpace: 'nowrap', overflow: 'auto', p: 0, scrollbarWidth: 0, scrollbarColor: 'transparent' } }
              : undefined
          }
          onChange={readonly ? undefined : (e) => setInputValue(e.target.value)}
        />
      </Stack>
      <LoadingButton
        variant="contained"
        type={readonly ? 'button' : 'submit'}
        onClick={readonly ? () => onSubmit(inputValue) : undefined}
        disabled={!readonly && inputValue === value}
        loading={pending}
      >
        {buttonName}
      </LoadingButton>
    </Stack>
  )
}
