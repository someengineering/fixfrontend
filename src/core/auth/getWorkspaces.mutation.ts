import { AxiosInstance } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetWorkspacesResponse } from 'src/shared/types/server'

export const getWorkspacesMutation = async (axios: AxiosInstance) => {
  return axios.get<GetWorkspacesResponse>(endPoints.workspaces.self).then((res) => res.data)
}
