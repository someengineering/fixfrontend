import { t } from '@lingui/macro'
import { TextField } from '@mui/material'
import { ChangeEvent, useState } from 'react'

interface WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInputProps<Name extends string> {
  name: Name
  label: string
  uuidRegex?: boolean
  defaultValue?: string
  disabled?: boolean
  onChange: (name: Name, value: string) => void
  onError: (name: Name, error?: string) => void
}
const UUIDRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gm

export function WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput<Name extends string>({
  label,
  name,
  uuidRegex,
  defaultValue,
  disabled,
  onChange,
  onError,
}: WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInputProps<Name>) {
  const [error, setError] = useState<string>()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    let error: string | undefined
    if (!value) {
      error = t`${label} is required`
    } else if (uuidRegex && !UUIDRegex.test(value)) {
      const regex = new RegExp(UUIDRegex)
      if (!regex.test(value)) {
        error = t`${label} is not valid`
      }
    }
    setError(error)
    onError(name, error)
    onChange(name, value)
  }
  return (
    <TextField
      name={name}
      placeholder={label}
      defaultValue={defaultValue}
      onChange={handleChange}
      required
      sx={{ width: 500, maxWidth: '100%' }}
      error={!!error}
      helperText={error}
      disabled={disabled}
    />
  )
}
