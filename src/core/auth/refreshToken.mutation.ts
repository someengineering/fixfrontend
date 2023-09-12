import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const refreshTokenMutation = async (refreshToken: string) => {
  return simpleAxios
    .post<string>(endPoints.auth.jwt.refresh, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
    .then((res) => res.data)
}
