import { GenericServerError } from 'src/shared/types/server-shared'

export type PostApiTokenResponse = {
  token: string
}

export type PostApiTokenErrorResponse = GenericServerError<[[422, [string]]]>
