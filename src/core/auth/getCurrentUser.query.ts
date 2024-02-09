import { AxiosInstance } from 'axios'
import { endPoints } from 'src/shared/constants'
import { setGTMConfig } from 'src/shared/google-tag-manager'
import { GetCurrentUserResponse } from 'src/shared/types/server'

export const getCurrentUserQuery = async (axios: AxiosInstance) => {
  return axios.get<GetCurrentUserResponse>(endPoints.users.me.self).then((res) => {
    setGTMConfig({ user_id: res.data.id })
    return res.data
  })
}
