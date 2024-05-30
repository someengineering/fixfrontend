import { endPoints } from 'src/shared/constants'
import { PostAuthMfaDisableResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postAuthMfaDisableMutation = async (data: { otp: string } | { recoveryCode: string }) => {
  return axiosWithAuth
    .post<PostAuthMfaDisableResponse>(
      endPoints.auth.mfa.disable,
      'otp' in data ? `otp=${data.otp}` : `recovery_code=${data.recoveryCode}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .then((res) => res.data)
}
