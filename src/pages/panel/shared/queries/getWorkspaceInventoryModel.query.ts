import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryModelResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryModelQuery = ({
  signal,
  queryKey: [_, workspaceId, kind],
}: QueryFunctionContext<['workspace-inventory-model', string | undefined, string | undefined]>) => {
  const params = {
    with_bases: false,
    with_property_kinds: false,
    flat: true,
  }
  return workspaceId && kind
    ? axiosWithAuth
        .get<GetWorkspaceInventoryModelResponse>(endPoints.workspaces.workspace(workspaceId).inventory.model, {
          signal,
          params: {
            kind,
            ...params,
          },
        })
        .then((res) => (res.data[0].type === 'object' ? res.data[0].properties : null))
    : null
}
