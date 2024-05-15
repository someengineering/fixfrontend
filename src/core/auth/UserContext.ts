import { createContext } from 'react'
import { GetCurrentUserResponse, GetWorkspaceResponse, GetWorkspacesResponse } from 'src/shared/types/server'
import { Permissions } from './getPermissions'

export type UserContextWorkspace = GetWorkspaceResponse & { permissions: Permissions[] }

export type UserContextRealValues = {
  isAuthenticated: boolean
  workspaces: UserContextWorkspace[] | never[]
  selectedWorkspace?: UserContextWorkspace
  currentUser?: GetCurrentUserResponse
}

export interface UserContextValue extends Partial<UserContextRealValues> {
  setAuth: (value: UserContextRealValues, url?: string) => void
  logout: (noWorkspace?: boolean) => Promise<void>
  refreshWorkspaces: () => Promise<GetWorkspacesResponse | undefined>
  selectWorkspace: (id: string) => Promise<GetWorkspaceResponse | undefined>
}

export const UserContext = createContext<UserContextValue | null>(null)
