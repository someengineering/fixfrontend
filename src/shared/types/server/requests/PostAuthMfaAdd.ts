import { GenericServerError } from 'src/shared/types/server-shared'

export type PostAuthMfaAddRequest = never

export interface PostAuthMfaAddResponse {
  secret: string
  recovery_codes: string[]
}

export type PostAuthMfaAddErrorResponse = GenericServerError<[[400, ['MFA already enabled']]]>
