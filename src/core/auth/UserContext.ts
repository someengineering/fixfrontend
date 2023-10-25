import { createContext } from 'react'
import { GetCurrentUserResponse, GetWorkspaceResponse, GetWorkspacesResponse } from 'src/shared/types/server'

export type UserContextRealValues = {
  isAuthenticated: boolean
  workspaces: GetWorkspacesResponse | never[]
  currentUser?: GetCurrentUserResponse
  selectedWorkspace?: GetWorkspaceResponse
}

export interface UserContextValue extends Partial<UserContextRealValues> {
  setAuth: (value: UserContextRealValues, url?: string) => void
  logout: () => void
  refreshWorkspaces: () => Promise<GetWorkspacesResponse | undefined>
  selectWorkspace: (id: string) => Promise<GetWorkspaceResponse | undefined>
}

export const UserContext = createContext<UserContextValue | null>(null)
