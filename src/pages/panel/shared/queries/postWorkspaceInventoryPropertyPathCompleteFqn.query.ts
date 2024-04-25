import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import {
  PostWorkspaceInventoryPropertyPathCompleteRequest,
  PostWorkspaceInventoryPropertyPathCompleteResponse,
  ResourceComplexKindSimpleTypeDefinitions,
} from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryPropertyPathCompleteFqnQuery = ({
  signal,
  queryKey: [, workspaceId, path, prop],
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-path-complete-query-fqn',
    string | undefined, // workspaceId
    string, // path
    string, // prop
  ]
>) => {
  const data: PostWorkspaceInventoryPropertyPathCompleteRequest = {
    path,
    prop,
    limit: 1,
    skip: 0,
    fuzzy: true,
  }
  return (
    (workspaceId &&
      axiosWithAuth
        .post<PostWorkspaceInventoryPropertyPathCompleteResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.path.complete,
          data,
          { signal },
        )
        .then((res) => Object.values(res.data)[0] as ResourceComplexKindSimpleTypeDefinitions)) ||
    null
  )
}
