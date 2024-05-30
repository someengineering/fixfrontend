import { GenericServerError } from 'src/shared/types/server-shared'

export type PostAuthMfaDisableRequest = never

export type PostAuthMfaDisableResponse = undefined

export type PostAuthMfaDisableErrorResponse = GenericServerError<[[428, ['OTP_NOT_PROVIDED_OR_INVALID']]]>
