import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { endPoints } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { jsonToStr } from 'src/shared/utils/jsonToStr'
import { getAuthData } from 'src/shared/utils/localstorage'

type queryFnStr =
  | 'getWorkspaceInventorySearchStartQuery'
  | 'getWorkspaceInventoryNodeQuery'
  | 'getCustomedWorkspaceInventoryPropertyAttributesQuery'
  | 'getWorkspaceInventoryPropertyAttributesQuery'
  | 'getWorkspaceInventoryPropertyPathCompleteQuery'
  | 'getWorkspaceInventoryPropertyValuesQuery'

const queryFnStrToApi = (queryFn: queryFnStr, workspaceId: string, id?: string) => {
  switch (queryFn) {
    case 'getWorkspaceInventorySearchStartQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.search.start

    case 'getWorkspaceInventoryNodeQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.node(id ?? 'unknown')

    case 'getWorkspaceInventoryPropertyAttributesQuery':
    case 'getCustomedWorkspaceInventoryPropertyAttributesQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.property.attributes

    case 'getWorkspaceInventoryPropertyPathCompleteQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.property.path.complete

    case 'getWorkspaceInventoryPropertyValuesQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.property.values

    default:
      return ''
  }
}

export const useInventorySendToGTM = () => {
  const handleSendToGTM = useCallback((queryFn: queryFnStr, isAdvanceSearch: boolean, error: AxiosError, params: unknown, id?: string) => {
    const { message, name, response, stack, status } = error
    const authorized = isAuthenticated()
    const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
    sendToGTM({
      event: 'inventory-error',
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
  }, [])

  return handleSendToGTM
}
