import { useContext } from 'react'
import { UserContext, UserContextValue } from './UserContext'

export function useUserProfile(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserProfile must be used inside the AuthGuard')
  }
  return context
}
