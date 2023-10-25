import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { endPoints, env } from 'src/shared/constants'
import { WebSocketEvent } from 'src/shared/types/server'
import { WebSocketEventsContext } from './WebSocketEventsContext'

const WS_CLOSE_CODE_NO_RETRY = 4001

export const WebSocketEvents = ({ children }: PropsWithChildren) => {
  const { selectedWorkspace, isAuthenticated } = useUserProfile()
  const listeners = useRef<{ [key in string]: (ev: MessageEvent) => void }>({})
  const messagesToSend = useRef<{ message: string; resolve: (value: string) => void; reject: (err: unknown) => void }[]>([])
  const websocket = useRef<WebSocket>()

  const handleRemoveListener = useCallback((id: string) => {
    if (websocket.current && listeners.current[id]) {
      websocket.current.removeEventListener('message', listeners.current[id])
    }
    delete listeners.current[id]
  }, [])

  const handleAddListener = useCallback(
    (id: string, onMessage: (ev: WebSocketEvent) => void) => {
      const randomId = `${Math.random()}|${id}`
      listeners.current[randomId] = (ev: MessageEvent<string>) => {
        try {
          onMessage(JSON.parse(ev.data) as WebSocketEvent)
        } catch {
          /* empty */
        }
      }
      if (websocket.current) {
        websocket.current.addEventListener('message', listeners.current[randomId])
      }
      return () => handleRemoveListener(randomId)
    },
    [handleRemoveListener],
  )

  const handleSendData = useCallback((data: WebSocketEvent) => {
    const message = JSON.stringify(data)
    return new Promise<string>((resolve, reject) => {
      try {
        if (websocket.current && websocket.current.readyState === websocket.current.OPEN) {
          websocket.current.send(message)
          resolve(message)
        } else if (websocket.current && websocket.current.readyState === websocket.current.CONNECTING) {
          websocket.current.addEventListener('open', () => {
            websocket.current?.send(JSON.stringify(data))
            resolve(message)
          })
        } else {
          messagesToSend.current.push({ message, resolve, reject })
        }
      } catch (err) {
        reject(err)
      }
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated && selectedWorkspace?.id) {
      const onClose = (ev: CloseEvent) => {
        if (ev.code !== WS_CLOSE_CODE_NO_RETRY) {
          setTimeout(createWebSocket, env.webSocketRetryTimeout)
        }
      }
      const onOpen = () => {
        for (const { message, reject, resolve } of messagesToSend.current) {
          try {
            websocket.current?.send(message)
            resolve(message)
          } catch (err) {
            reject(err)
          }
        }
        messagesToSend.current = []
      }
      const createWebSocket = () => {
        websocket.current = new window.WebSocket(`${env.wsUrl}/${endPoints.workspaces.events(selectedWorkspace.id)}`)
        websocket.current.addEventListener('close', onClose)
        websocket.current.addEventListener('open', onOpen)
        for (const key in listeners.current) {
          websocket.current.addEventListener('message', listeners.current[key])
        }
      }
      createWebSocket()
      return () => {
        if (websocket.current) {
          websocket.current.removeEventListener('close', onClose)
          websocket.current.removeEventListener('open', onOpen)
          for (const key in listeners.current) {
            websocket.current.removeEventListener('message', listeners.current[key])
          }
          listeners.current = {}
          if (websocket.current.readyState !== websocket.current.CLOSED && websocket.current.readyState !== websocket.current.CLOSING) {
            websocket.current.close(WS_CLOSE_CODE_NO_RETRY)
          }
        }
        websocket.current = undefined
      }
    } else if (websocket.current) {
      for (const key in listeners.current) {
        websocket.current.removeEventListener('message', listeners.current[key])
      }
      listeners.current = {}
      if (websocket.current.readyState !== websocket.current.CLOSED && websocket.current.readyState !== websocket.current.CLOSING) {
        websocket.current.close(WS_CLOSE_CODE_NO_RETRY)
      }
      websocket.current = undefined
    }
  }, [selectedWorkspace?.id, isAuthenticated])

  return (
    <WebSocketEventsContext.Provider value={{ addListener: handleAddListener, websocket, send: handleSendData }}>
      {children}
    </WebSocketEventsContext.Provider>
  )
}
