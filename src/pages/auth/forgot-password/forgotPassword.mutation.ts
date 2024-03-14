import { endPoints } from 'src/shared/constants'
import { PostAuthForgotPasswordRequest } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const forgotPasswordMutation = async ({ redirectUrl, ...body }: PostAuthForgotPasswordRequest & { redirectUrl: string }) => {
  return simpleAxios.post<undefined>(endPoints.auth.forgotPassword, body, { params: { redirectUrl } }).then((res) => res.data)
}
