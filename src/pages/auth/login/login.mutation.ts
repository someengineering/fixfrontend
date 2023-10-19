import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const loginMutation = async ({ username, password }: { username: string; password: string }) => {
  return simpleAxios
    .post<string>(endPoints.auth.jwt.login, `username=${username}&password=${password}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => res.data)
}
