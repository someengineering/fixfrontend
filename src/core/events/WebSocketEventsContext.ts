import { MutableRefObject, createContext } from 'react'
import { WebSocketEvent } from 'src/shared/types/server'

type WebSocketEventsContextRealValues = {
  websocket: MutableRefObject<WebSocket | undefined>
}

export interface WebSocketEventsContextValue extends Partial<WebSocketEventsContextRealValues> {
  addListener: (id: string, onMessage: (ev: WebSocketEvent) => void) => () => void
  send: (data: WebSocketEvent) => Promise<string>
}

export const WebSocketEventsContext = createContext<WebSocketEventsContextValue | null>(null)
