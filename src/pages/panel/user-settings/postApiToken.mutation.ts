import { endPoints } from 'src/shared/constants'
import { PostApiTokenRequest, PostApiTokenResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postApiTokenMutation = async (data: PostApiTokenRequest) => {
  return axiosWithAuth.post<PostApiTokenResponse>(endPoints.token.self, data).then((res) => res.data)
}
