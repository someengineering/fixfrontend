import { t } from '@lingui/macro'
import { AxiosError } from 'axios'
import {
  PostAuthJWTLoginErrorResponse,
  PostAuthMfaAddErrorResponse,
  PostAuthMfaDisableErrorResponse,
  PostAuthMfaEnableErrorResponse,
  PostAuthRegisterLiteralErrorResponse,
} from 'src/shared/types/server'
import { LiteralUnion } from 'src/shared/types/shared'

type AllErrors =
  | PostAuthJWTLoginErrorResponse
  | PostAuthRegisterLiteralErrorResponse
  | PostAuthMfaAddErrorResponse
  | PostAuthMfaEnableErrorResponse
  | PostAuthMfaDisableErrorResponse

export const getErrorDetailMessage = (detail: LiteralUnion<AllErrors['detail'], string>, withTryAgain?: boolean) => {
  switch (detail) {
    case 'MFA already enabled':
      return t`MFA already enabled`
    case 'OTP_NOT_PROVIDED_OR_INVALID':
      return t`The OTP or recovery code you entered is incorrect or the OTP has expired. Please try entering it again.`
    case 'LOGIN_BAD_CREDENTIALS':
      return t`Oops, the username or password doesn't seem to match our records. Please try again.`
    case 'LOGIN_USER_NOT_VERIFIED':
      return t`Your email address isn't verified yet. Please check your inbox and click on the 'Verify' button to complete the process. Can't find the email? It might be in your spam folder.`
    case 'REGISTER_USER_ALREADY_EXISTS':
      return t`This email address is already registered. If this is your email, please try logging in or click on forgot password in login page to reset your password.`
    case 'Disposable email domains are not allowed':
      return t`Disposable email domains are not allowed`
    default:
      return withTryAgain ? t`An error occurred, please try again later.${detail ? ` Error: ${detail}` : ''}` : detail
  }
}

export const getErrorResponseMessage = (data: AllErrors, withTryAgain?: boolean) => getErrorDetailMessage(data.detail, withTryAgain)

export const getErrorMessage = (error: unknown, withTryAgain?: boolean) => {
  const errorResponse = (error as AxiosError<AllErrors>)?.response?.data
  return errorResponse ? getErrorResponseMessage(errorResponse, withTryAgain) : undefined
}
