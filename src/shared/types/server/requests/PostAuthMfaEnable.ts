import { GenericServerError } from 'src/shared/types/server-shared'

export type PostAuthMfaEnableRequest = never

export type PostAuthMfaEnableResponse = undefined

export type PostAuthMfaEnableErrorResponse = GenericServerError<[[400, ['MFA already enabled']], [428, ['OTP_NOT_PROVIDED_OR_INVALID']]]>
