import { createContext, useContext } from 'react'

export type UserContextRealValues = {
  isAuthenticated: boolean
}

export interface UserContextValue extends Partial<UserContextRealValues> {
  setAuth: (value: UserContextRealValues, url?: string) => void
  logout: () => void
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUserProfile(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserProfile must be used inside the AuthGuard')
  }
  return context
}
