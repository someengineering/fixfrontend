import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCfTemplateResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCfTemplateQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-cf-template', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth.get<GetWorkspaceCfTemplateResponse>(endPoints.workspaces.cf_template(workspaceId), { signal }).then((res) => res.data)
    : undefined
}
