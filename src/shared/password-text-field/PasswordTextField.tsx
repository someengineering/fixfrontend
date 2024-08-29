import { IconButton, InputProps, TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'
import { ShowIcon, VisibilityOffIcon } from 'src/assets/icons'

export interface PasswordTextFieldProps extends Omit<TextFieldProps, 'type' | 'InputProps'> {
  InputProps?: Omit<InputProps, 'endAdornment'>
}

export const PasswordTextField = (props: PasswordTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
            {showPassword ? <VisibilityOffIcon /> : <ShowIcon />}
          </IconButton>
        ),
      }}
    />
  )
}
