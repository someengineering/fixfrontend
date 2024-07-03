import { endPoints } from 'src/shared/constants'
import { PostAuthJWTLoginRequest, PostAuthJWTLoginResponse } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const loginMutation = async ({ username, password, otp, recoveryCode }: PostAuthJWTLoginRequest) => {
  return simpleAxios
    .post<PostAuthJWTLoginResponse>(
      endPoints.auth.jwt.login,
      `username=${window.encodeURIComponent(username)}&password=${window.encodeURIComponent(password)}${otp ? `&otp=${otp}` : recoveryCode ? `&recovery_code=${recoveryCode}` : ''}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .then((res) => res.data)
}
