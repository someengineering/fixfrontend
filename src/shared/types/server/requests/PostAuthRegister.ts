import { GenericServerError, User } from 'src/shared/types/server-shared'
import { LiteralUnion } from 'src/shared/types/shared'

export type PostAuthRegisterRequest = {
  email: string
  password: string
}

export type PostAuthRegisterResponse = User

export type PostAuthRegisterLiteralErrorResponse = GenericServerError<
  [[400, ['Disposable email domains are not allowed', 'REGISTER_USER_ALREADY_EXISTS']], [428, ['OTP_NOT_PROVIDED_OR_INVALID']]]
>

export type PostAuthRegisterObjectErrorResponse = GenericServerError<
  [[400, [{ code: 'REGISTER_INVALID_PASSWORD'; reason: LiteralUnion<'Invalid', string> }]]]
>

export type PostAuthRegisterErrorResponse = PostAuthRegisterLiteralErrorResponse | PostAuthRegisterObjectErrorResponse
