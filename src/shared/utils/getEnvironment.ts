import { endPoints } from 'src/shared/constants'
import { GetInfoResponse } from 'src/shared/types/server'
import { simpleAxios } from './axios'

export const getEnvironmentStr = async () => {
  return simpleAxios.get<GetInfoResponse>(endPoints.info).then((res) => res.data)
}
