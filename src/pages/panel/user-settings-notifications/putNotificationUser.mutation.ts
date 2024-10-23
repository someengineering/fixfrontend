import { endPoints } from 'src/shared/constants'
import { GetNotificationUserResponse, PutNotificationUserRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putNotificationUserMutation = async (data: PutNotificationUserRequest) => {
  return axiosWithAuth.put<GetNotificationUserResponse>(endPoints.users.me.settings.notifications, data).then((res) => res.data)
}
