import { endPoints } from 'src/shared/constants'
import { PostAuthResetPasswordRequest } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const resetPasswordMutation = async ({ ...body }: PostAuthResetPasswordRequest) => {
  return simpleAxios.post<undefined>(endPoints.auth.resetPassword, body).then((res) => res.data)
}
