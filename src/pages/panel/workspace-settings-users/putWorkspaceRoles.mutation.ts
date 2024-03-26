import { endPoints } from 'src/shared/constants'
import { PutWorkspaceRolesRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceRolesMutation = async ({ workspaceId, ...body }: PutWorkspaceRolesRequest & { workspaceId: string }) => {
  return axiosWithAuth
    .put<Required<PutWorkspaceRolesRequest>>(endPoints.workspaces.workspace(workspaceId).roles.self(body.user_id), body)
    .then((res) => res.data)
}
