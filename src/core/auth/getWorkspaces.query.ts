import { AxiosInstance } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetWorkspacesResponse } from 'src/shared/types/server'
import { getPermissions } from './getPermissions'

export const getWorkspacesQuery = async (axios: AxiosInstance) => {
  return axios
    .get<GetWorkspacesResponse>(endPoints.workspaces.self)
    .then((res) => res.data?.map((workspace) => ({ ...workspace, permissions: getPermissions(workspace.user_permissions) })))
}
