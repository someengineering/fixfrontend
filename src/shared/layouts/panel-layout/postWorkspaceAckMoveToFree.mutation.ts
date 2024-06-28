import { endPoints } from 'src/shared/constants'
import { GetWorkspaceResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceAckMoveToFreeMutation = ({ workspaceId }: { workspaceId: string }) =>
  axiosWithAuth.post<GetWorkspaceResponse>(endPoints.workspaces.workspace(workspaceId).ackMoveToFree)
