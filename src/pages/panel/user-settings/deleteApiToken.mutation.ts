import { endPoints } from 'src/shared/constants'
import { DeleteApiTokenRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteApiTokenMutation = async (data: DeleteApiTokenRequest) => {
  return axiosWithAuth.delete<null>(endPoints.token.self, { data }).then((res) => res.data)
}
