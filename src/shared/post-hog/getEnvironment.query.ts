import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetInfoResponse } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const getEnvironmentQuery = ({ signal }: QueryFunctionContext<['environment']>) => {
  return simpleAxios.get<GetInfoResponse>(endPoints.info, { signal }).then((res) => res.data)
}
