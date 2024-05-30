import { endPoints } from 'src/shared/constants'
import { PostAuthMfaEnableResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postAuthMfaEnableMutation = async ({ otp }: { otp: string }) => {
  return axiosWithAuth
    .post<PostAuthMfaEnableResponse>(endPoints.auth.mfa.enable, `otp=${otp}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => res.data)
}
