import { useContext } from 'react'
import { UserContext, UserContextValue } from './UserContext'

export function useUserProfile(doNotThrowError?: false): UserContextValue
export function useUserProfile(doNotThrowError?: true): UserContextValue | null
export function useUserProfile(doNotThrowError?: boolean) {
  const context = useContext(UserContext)
  if (!context && !doNotThrowError) {
    throw new Error('useUserProfile must be used inside the AuthGuard')
  }
  return context
}
