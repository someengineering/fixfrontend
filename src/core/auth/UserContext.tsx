import { createContext, useContext } from 'react'
import { GetOrganizationResponse, GetOrganizationsResponse } from 'src/shared/types/server'

export type UserContextRealValues = {
  isAuthenticated: boolean
  organizations: GetOrganizationsResponse | never[]
  selectedOrganization?: GetOrganizationResponse
}

export interface UserContextValue extends Partial<UserContextRealValues> {
  setAuth: (value: UserContextRealValues, url?: string) => void
  logout: () => void
  refreshOrganizations: () => Promise<GetOrganizationsResponse>
  selectOrganization: (id: string) => Promise<GetOrganizationResponse | undefined>
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUserProfile(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserProfile must be used inside the AuthGuard')
  }
  return context
}
