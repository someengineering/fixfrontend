import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInviteRequest, WorkspaceInvite } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInviteMutation = async ({ workspaceId, ...body }: PostWorkspaceInviteRequest & { workspaceId: string }) => {
  return axiosWithAuth.post<WorkspaceInvite>(endPoints.workspaces.workspace(workspaceId).invites.list, body).then((res) => res.data)
}
