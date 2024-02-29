import { AxiosInstance } from 'axios'
import { md5 } from 'js-md5'
import { endPoints } from 'src/shared/constants'
import { sendToGTM, setGTMConfig } from 'src/shared/google-tag-manager'
import { GetCurrentUserResponse } from 'src/shared/types/server'

export const getCurrentUserQuery = async (axios: AxiosInstance) => {
  return axios.get<GetCurrentUserResponse>(endPoints.users.me.self).then((res) => {
    const userId = md5(res.data.id)
    setGTMConfig({ user_id: userId })
    sendToGTM({ user_id: userId })
    return res.data
  })
}
