import { endPoints } from 'src/shared/constants'
import { PatchCurrentUserRequest, PatchCurrentUserResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchUsersMeMutation = async (data: PatchCurrentUserRequest) => {
  return axiosWithAuth.patch<PatchCurrentUserResponse>(endPoints.users.me.self, data).then((res) => res.data)
}
