import { GenericServerError } from 'src/shared/types/server-shared'

export type PostAuthJWTLoginRequest = {
  username: string
  password: string
  otp?: string
  recoveryCode?: string
}

export type PostAuthJWTLoginResponse = string

export type PostAuthJWTLoginErrorResponse = GenericServerError<
  [[400, ['LOGIN_BAD_CREDENTIALS', 'LOGIN_USER_NOT_VERIFIED']], [428, ['OTP_NOT_PROVIDED_OR_INVALID']]]
>
