import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const logoutMutation = async () => {
  return axiosWithAuth.post<undefined>(endPoints.auth.jwt.logout)
}
