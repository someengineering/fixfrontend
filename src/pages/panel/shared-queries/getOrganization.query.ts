import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetOrganizationsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getOrganizationQuery = ({ signal }: QueryFunctionContext) => {
  return axiosWithAuth.get<GetOrganizationsResponse>(endPoints.organizations.get, { signal }).then((res) => res.data)
}
