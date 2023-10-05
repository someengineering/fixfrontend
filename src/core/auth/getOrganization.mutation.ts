import { AxiosInstance } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetOrganizationsResponse } from 'src/shared/types/server'

export const getOrganizationMutation = async (axios: AxiosInstance) => {
  return axios.get<GetOrganizationsResponse>(endPoints.organizations.get).then((res) => res.data)
}
