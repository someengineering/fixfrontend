import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceInviteMutation = async ({ inviteId, workspaceId }: { inviteId: string; workspaceId: string }) => {
  return axiosWithAuth.delete<string>(endPoints.workspaces.workspace(workspaceId).invites.self(inviteId)).then((res) => res.data)
}
