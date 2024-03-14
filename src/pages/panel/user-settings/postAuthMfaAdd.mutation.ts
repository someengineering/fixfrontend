import { endPoints } from 'src/shared/constants'
import { PostAuthMfaAddResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postAuthMfaAddMutation = async () => {
  return axiosWithAuth.post<PostAuthMfaAddResponse>(endPoints.auth.mfa.add).then((res) => res.data)
}
