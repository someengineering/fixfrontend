import { t } from '@lingui/macro'
import { usePostHog } from 'posthog-js/react'
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { apiMessages, endPoints, env } from 'src/shared/constants'
import { PostHogEvent } from 'src/shared/posthog'
import { WebSocketEvent } from 'src/shared/types/server'
import { isAuthenticated as getIsAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { WebSocketEventsContext } from './WebSocketEventsContext'

const WS_CLOSE_CODE_NO_RETRY = 4001
const WS_SERVER_CLOSE_CODE_NO_RETRY = 4401

export const WebSocketEvents = ({ children }: PropsWithChildren) => {
  const postHog = usePostHog()
  const { currentUser, selectedWorkspace, isAuthenticated, logout } = useUserProfile()
  const noRetry = useRef(false)
  const listeners = useRef<Record<string, (ev: MessageEvent) => void>>({})
  const messagesToSend = useRef<{ message: string; resolve: (value: string) => void; reject: (err: unknown) => void }[]>([])
  const websocket = useRef<WebSocket>()
  const { showSnackbar } = useSnackbar()

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
          if (window.TrackJS?.isInstalled()) {
            window.TrackJS.track(err as Error)
          }
          const { name: error_name, message: error_message, stack: error_stack } = err as Error
          const workspaceId = getAuthData()?.selectedWorkspaceId || undefined
          postHog.capture(PostHogEvent.WebsocketError, {
            $set: { ...currentUser },
            authenticated: getIsAuthenticated(),
            user_id: currentUser?.id,
            workspace_id: workspaceId,
            api_endpoint: `${env.wsUrl}/${endPoints.workspaces.workspace(workspaceId ?? 'unknown').events}`,
            error_name,
            error_message,
            error_stack,
            state: 'on-message',
            data: ev.data,
          })
        }
      }
      if (websocket.current) {
        websocket.current.addEventListener('message', listeners.current[randomId])
      }
      return () => handleRemoveListener(randomId)
    },
    [currentUser, handleRemoveListener, postHog],
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
          if (window.TrackJS?.isInstalled()) {
            window.TrackJS.track(err as Error)
          }
          const { name: error_name, message: error_message, stack: error_stack } = err as Error
          const workspaceId = getAuthData()?.selectedWorkspaceId || undefined
          postHog.capture(PostHogEvent.WebsocketError, {
            $set: { ...currentUser },
            authenticated: getIsAuthenticated(),
            user_id: currentUser?.id,
            workspace_id: workspaceId,
            api_endpoint: `${env.wsUrl}/${endPoints.workspaces.workspace(workspaceId ?? 'unknown').events}`,
            error_name,
            error_message,
            error_stack,
            state: 'send-message',
            message,
          })
          reject(err)
        }
      })
    },
    [currentUser, postHog],
  )

  useEffect(() => {
    if (isAuthenticated && selectedWorkspace?.id) {
      let retryTimeout = env.webSocketRetryTimeout
      const onClose = (ev: CloseEvent) => {
        if (ev.code !== 1000) {
          const err = new Error('Websocket connection closed')
          if (window.TrackJS?.isInstalled()) {
            window.TrackJS.track(err)
          }
          const workspaceId = getAuthData()?.selectedWorkspaceId || undefined
          postHog.capture(PostHogEvent.WebsocketError, {
            $set: { ...currentUser },
            authenticated: getIsAuthenticated(),
            user_id: currentUser?.id,
            workspace_id: workspaceId,
            api_endpoint: `${env.wsUrl}/${endPoints.workspaces.workspace(workspaceId ?? 'unknown').events}`,
            error_name: err.name,
            error_message: err.message,
            error_stack: err.stack,
            state: 'on-open',
            close_code: ev.code,
            close_reason: ev.reason,
            close_was_clean: ev.wasClean,
          })
        }
        if (ev.code === WS_SERVER_CLOSE_CODE_NO_RETRY) {
          showSnackbar(
            ev.reason === apiMessages.paymentOnHold
              ? t`Payment is required for your workspace, Please contact the workspace owner`
              : t`You don't have access to this workspace`,
            {
              severity: 'error',
              autoHideDuration: null,
            },
          )
          logout(true)
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
            if (window.TrackJS?.isInstalled()) {
              window.TrackJS.track(err as Error)
            }
            const { name: error_name, message: error_message, stack: error_stack } = err as Error
            const workspaceId = getAuthData()?.selectedWorkspaceId || undefined
            postHog.capture(PostHogEvent.WebsocketError, {
              $set: { ...currentUser },
              authenticated: getIsAuthenticated(),
              user_id: currentUser?.id,
              workspace_id: workspaceId,
              api_endpoint: `${env.wsUrl}/${endPoints.workspaces.workspace(workspaceId ?? 'unknown').events}`,
              error_name,
              error_message,
              error_stack,
              state: 'on-open',
              message,
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
  }, [selectedWorkspace?.id, isAuthenticated, logout, showSnackbar, postHog, currentUser])

  return (
    <WebSocketEventsContext.Provider value={{ addListener: handleAddListener, websocket, send: handleSendData }}>
      {children}
    </WebSocketEventsContext.Provider>
  )
}
