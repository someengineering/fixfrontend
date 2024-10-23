import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetNotificationUserResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getNotificationUserQuery = async ({ signal }: QueryFunctionContext<['notification-user', string | undefined]>) => {
  return axiosWithAuth.get<GetNotificationUserResponse>(endPoints.users.me.settings.notifications, { signal }).then((res) => res.data)
}
