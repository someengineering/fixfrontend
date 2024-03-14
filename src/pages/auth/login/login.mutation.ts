import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const loginMutation = async ({
  username,
  password,
  otp,
  recoveryCode,
}: {
  username: string
  password: string
  otp?: string
  recoveryCode?: string
}) => {
  return simpleAxios
    .post<string>(
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
