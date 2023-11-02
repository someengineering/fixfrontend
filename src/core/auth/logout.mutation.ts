import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const logoutMutation = async () => {
  return simpleAxios
    .post<undefined>(endPoints.auth.jwt.logout, null, {
      withCredentials: true,
    })
    .catch(() => {})
}
