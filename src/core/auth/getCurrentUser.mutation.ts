import { AxiosInstance } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetCurrentUserResponse } from 'src/shared/types/server'

export const getCurrentUserMutation = async (axios: AxiosInstance) => {
  return axios.get<GetCurrentUserResponse>(endPoints.users.me).then((res) => res.data)
}
