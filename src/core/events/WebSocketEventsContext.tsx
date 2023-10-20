import { MutableRefObject, createContext, useContext } from 'react'
import { WebSocketEvent } from 'src/shared/types/server'

export type WebSocketEventsContextRealValues = {
  websocket: MutableRefObject<WebSocket | undefined>
}

export interface WebSocketEventsContextValue extends Partial<WebSocketEventsContextRealValues> {
  addListener: (id: string, onMessage: (ev: WebSocketEvent) => void) => () => void
  send: (data: WebSocketEvent) => Promise<string>
}

export const WebSocketEventsContext = createContext<WebSocketEventsContextValue | null>(null)

export function useEvents(): WebSocketEventsContextValue {
  const context = useContext(WebSocketEventsContext)
  if (!context) {
    throw new Error('useUserProfile must be used inside the AuthGuard')
  }
  return context
}
