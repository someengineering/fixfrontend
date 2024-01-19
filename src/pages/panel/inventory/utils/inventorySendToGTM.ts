import { AxiosError } from 'axios'
import { GTMEventNames, endPoints } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { jsonToStr } from 'src/shared/utils/jsonToStr'
import { getAuthData } from 'src/shared/utils/localstorage'
import { TrackJS } from 'trackjs'

type queryFnStr =
  | 'getWorkspaceInventorySearchStartQuery'
  | 'postWorkspaceInventoryNodeQuery'
  | 'postCostumedWorkspaceInventoryPropertyAttributesQuery'
  | 'postWorkspaceInventoryPropertyAttributesQuery'
  | 'postWorkspaceInventoryPropertyPathCompleteQuery'
  | 'postWorkspaceInventoryPropertyValuesQuery'

const queryFnStrToApi = (queryFn: queryFnStr, workspaceId: string, id?: string) => {
  switch (queryFn) {
    case 'getWorkspaceInventorySearchStartQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.search.start

    case 'postWorkspaceInventoryNodeQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.node(id ?? 'unknown')

    case 'postWorkspaceInventoryPropertyAttributesQuery':
    case 'postCostumedWorkspaceInventoryPropertyAttributesQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.property.attributes

    case 'postWorkspaceInventoryPropertyPathCompleteQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.property.path.complete

    case 'postWorkspaceInventoryPropertyValuesQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.property.values

    default:
      return ''
  }
}

export const inventorySendToGTM = (queryFn: queryFnStr, isAdvanceSearch: boolean, error: AxiosError, params: unknown, id?: string) => {
  if (TrackJS.isInstalled()) {
    TrackJS.track(error)
  }
  const { message, name, response, stack, status } = error
  const authorized = isAuthenticated()
  const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
  sendToGTM({
    event: GTMEventNames.InventoryError,
    api: queryFnStrToApi(queryFn, workspaceId, id),
    authorized,
    isAdvanceSearch,
    params,
    name: jsonToStr(name),
    stack: jsonToStr(stack),
    message: jsonToStr(message),
    request: jsonToStr(error.request as unknown),
    response: jsonToStr(response),
    status: jsonToStr(status),
    workspaceId,
  })
}
