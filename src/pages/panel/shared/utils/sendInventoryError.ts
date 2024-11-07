import { AxiosError } from 'axios'
import { PostHog } from 'posthog-js/react'
import { endPoints } from 'src/shared/constants'
import { PostHogEvent } from 'src/shared/posthog'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'

type queryFnStr =
  | 'getWorkspaceInventorySearchStartQuery'
  | 'getWorkspaceInventoryNodeQuery'
  | 'postCostumedWorkspaceInventoryPropertyAttributesQuery'
  | 'postWorkspaceInventoryPropertyAttributesQuery'
  | 'postWorkspaceInventoryPropertyPathCompleteQuery'
  | 'postWorkspaceInventoryPropertyValuesQuery'

const queryFnStrToApiEndpoint = (queryFn: queryFnStr, workspaceId: string, id?: string) => {
  switch (queryFn) {
    case 'getWorkspaceInventorySearchStartQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.search.start

    case 'getWorkspaceInventoryNodeQuery':
      return endPoints.workspaces.workspace(workspaceId).inventory.node(id ?? 'unknown').self

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

export const sendInventoryError = ({
  currentUser,
  workspaceId,
  queryFn,
  isAdvancedSearch,
  error,
  params,
  id,
  postHog,
}: {
  currentUser?: GetCurrentUserResponse
  workspaceId?: string
  queryFn: queryFnStr
  isAdvancedSearch: boolean
  error: AxiosError
  params?: Record<string, unknown>
  id?: string
  postHog: PostHog
}) => {
  if (postHog) {
    const selectedWorkspaceId = workspaceId || getAuthData()?.selectedWorkspaceId || undefined

    postHog.capture(PostHogEvent.InventoryError, {
      ...params,
      $set: { ...currentUser },
      authenticated: isAuthenticated(),
      user_id: currentUser?.id,
      workspace_id: selectedWorkspaceId,
      api_endpoint: queryFnStrToApiEndpoint(queryFn, selectedWorkspaceId || 'unknown', id),
      advanced_search: isAdvancedSearch,
      error_name: error.name,
      error_message: error.message,
      error_status: error.status,
      error_stack: error.stack,
      error_response: error.response ? JSON.stringify(error.response) : undefined,
    })
  }
}
