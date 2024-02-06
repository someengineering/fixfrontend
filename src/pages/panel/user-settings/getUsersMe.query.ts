import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getUsersMeQuery = async ({ signal }: QueryFunctionContext<['users-me', string | undefined]>) => {
  return axiosWithAuth.get<GetCurrentUserResponse>(endPoints.users.me.self, { signal }).then((res) => res.data)
}
