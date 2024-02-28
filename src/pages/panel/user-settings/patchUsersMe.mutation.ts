import { endPoints } from 'src/shared/constants'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchUsersMeMutation = async (data: { password?: string; email?: string }) => {
  return axiosWithAuth.patch<GetCurrentUserResponse>(endPoints.users.me.self, data).then((res) => res.data)
}
