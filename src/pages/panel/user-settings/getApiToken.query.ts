import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetApiTokenResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getApiTokenQuery = async ({ signal }: QueryFunctionContext<['api-token']>) => {
  return axiosWithAuth.get<GetApiTokenResponse>(endPoints.token.self, { signal }).then((res) => res.data)
}
