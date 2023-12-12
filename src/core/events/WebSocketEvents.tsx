import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { endPoints, env } from 'src/shared/constants'
import { useGTMDispatch } from 'src/shared/google-tag-manager'
import { WebSocketEvent } from 'src/shared/types/server'
import { WebSocketEventsContext } from './WebSocketEventsContext'

const WS_CLOSE_CODE_NO_RETRY = 4001
const WS_SERVER_CLOSE_CODE_NO_RETRY = 4401

export const WebSocketEvents = ({ children }: PropsWithChildren) => {
  const { selectedWorkspace, isAuthenticated, logout } = useUserProfile()
  const sendToGTM = useGTMDispatch()
  const noRetry = useRef(false)
  const listeners = useRef<Record<string, (ev: MessageEvent) => void>>({})
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
          const message = JSON.parse(ev.data) as WebSocketEvent
          onMessage(message)
        } catch (err) {
          const { message, name, stack = 'unknown' } = err as Error
          sendToGTM({
            event: 'socket-error',
            api: `${env.wsUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? 'unknown').events}`,
            authorized: isAuthenticated ?? false,
            message: message,
            name,
            stack,
            state: 'on-message',
            params: ev.data,
            workspaceId: selectedWorkspace?.id ?? 'unknown',
          })
        }
      }
      if (websocket.current) {
        websocket.current.addEventListener('message', listeners.current[randomId])
      }
      return () => handleRemoveListener(randomId)
    },
    [handleRemoveListener, isAuthenticated, selectedWorkspace?.id, sendToGTM],
  )

  const handleSendData = useCallback(
    (data: WebSocketEvent) => {
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
          const { message, name, stack = 'unknown' } = err as Error
          sendToGTM({
            event: 'socket-error',
            api: `${env.wsUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? 'unknown').events}`,
            authorized: isAuthenticated ?? false,
            message: message,
            name,
            stack,
            state: 'send-message',
            params: message,
            workspaceId: selectedWorkspace?.id ?? 'unknown',
          })
          reject(err)
        }
      })
    },
    [isAuthenticated, selectedWorkspace?.id, sendToGTM],
  )

  useEffect(() => {
    if (isAuthenticated && selectedWorkspace?.id) {
      let retryTimeout = env.webSocketRetryTimeout
      const onClose = (ev: CloseEvent) => {
        if (ev.code !== 1000) {
          const { stack = 'unknown', name, message } = Error('Websocket connection closed')
          sendToGTM({
            event: 'socket-error',
            api: `${env.wsUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? 'unknown').events}`,
            authorized: isAuthenticated ?? false,
            message,
            name,
            stack,
            state: 'on-open',
            params: `reason: ${ev.reason}, code: ${ev.code}, was clean: ${ev.wasClean}`,
            workspaceId: selectedWorkspace?.id ?? 'unknown',
          })
        }
        if (ev.code === WS_SERVER_CLOSE_CODE_NO_RETRY) {
          void logout()
        } else if (ev.code !== WS_CLOSE_CODE_NO_RETRY && !noRetry.current) {
          if (isAuthenticated && selectedWorkspace?.id) {
            window.setTimeout(createWebSocket, retryTimeout)
            retryTimeout *= 2
          }
        }
      }
      const onOpen = () => {
        for (const { message, reject, resolve } of messagesToSend.current) {
          try {
            websocket.current?.send(message)
            resolve(message)
          } catch (err) {
            const { message, name, stack = 'unknown' } = err as Error
            sendToGTM({
              event: 'socket-error',
              api: `${env.wsUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? 'unknown').events}`,
              authorized: isAuthenticated ?? false,
              message: message,
              name,
              stack,
              state: 'on-open',
              params: message,
              workspaceId: selectedWorkspace?.id ?? 'unknown',
            })
            reject(err)
          }
        }
        messagesToSend.current = []
      }
      const createWebSocket = () => {
        websocket.current = new window.WebSocket(`${env.wsUrl}/${endPoints.workspaces.workspace(selectedWorkspace.id).events}`)
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
      noRetry.current = false
      websocket.current = undefined
    } else {
      noRetry.current = false
    }
  }, [selectedWorkspace?.id, isAuthenticated, logout, sendToGTM])

  return (
    <WebSocketEventsContext.Provider value={{ addListener: handleAddListener, websocket, send: handleSendData }}>
      {children}
    </WebSocketEventsContext.Provider>
  )
}
