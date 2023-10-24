import { useContext } from 'react'
import { WebSocketEventsContext, WebSocketEventsContextValue } from './WebSocketEventsContext'

export function useEvents(): WebSocketEventsContextValue {
  const context = useContext(WebSocketEventsContext)
  if (!context) {
    throw new Error('useUserProfile must be used inside the AuthGuard')
  }
  return context
}
