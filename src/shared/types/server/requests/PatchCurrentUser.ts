import { GetCurrentUserResponse } from 'src/shared/types/server'
import { GenericServerError } from 'src/shared/types/server-shared'
import { LiteralUnion } from 'src/shared/types/shared'

export type PatchCurrentUserRequest = {
  password?: string
  email?: string
}

export type PatchCurrentUserResponse = GetCurrentUserResponse

export type PatchCurrentUserErrorResponse = GenericServerError<
  [[400, [{ code: 'UPDATE_USER_INVALID_PASSWORD'; reason: LiteralUnion<'Invalid', string> }]]]
>
