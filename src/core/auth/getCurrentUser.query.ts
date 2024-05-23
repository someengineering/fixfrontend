import { AxiosInstance } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetCurrentUserResponse } from 'src/shared/types/server'

export const getCurrentUserQuery = async (axios: AxiosInstance) => {
  return axios.get<GetCurrentUserResponse>(endPoints.users.me.self).then((res) => res.data)
}
