import { endPoints } from 'src/shared/constants'
import { PostAuthRegisterRequest, PostAuthRegisterResponse } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const registerMutation = async ({ redirectUrl, ...body }: PostAuthRegisterRequest & { redirectUrl: string }) => {
  return simpleAxios.post<PostAuthRegisterResponse>(endPoints.auth.register, body, { params: { redirectUrl } }).then((res) => res.data)
}
