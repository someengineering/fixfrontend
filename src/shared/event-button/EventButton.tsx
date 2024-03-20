import { t } from '@lingui/macro'
import EventIcon from '@mui/icons-material/Event'
import { Badge, Box, Fade, IconButton, Paper, Popper, Tooltip, styled } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useEvents } from 'src/core/events'
import { useSnackbar } from 'src/core/snackbar'
import { CollectProgressEvent, WebSocketEvent } from 'src/shared/types/server'
import { EventItem } from './EventItem'
import { mergeProgressEventParts } from './mergeProgressEventParts'

const PopperContainer = styled(Popper)(({ theme }) => ({
  marginTop: 45,
  zIndex: theme.zIndex.tooltip,
}))

export const EventButton = () => {
  const [openEvents, setOpenEvents] = useState(false)
  const queryClient = useQueryClient()
  const anchorEl = useRef<HTMLButtonElement>(null)
  const { showSnackbar } = useSnackbar()
  const { addListener, send } = useEvents()
  const [events, setEvents] = useState<WebSocketEvent[]>([])

  useEffect(() => {
    const eventListener = (ev: WebSocketEvent) => {
      switch (ev.kind) {
        case 'collect-progress': {
          const hasProgress = ev.data.message.parts.find((i) => i.current !== i.total)
          setEvents((prev) => {
            const foundIndex = prev.findIndex((item) => item.kind === ev.kind)
            if (foundIndex === -1 && !hasProgress) {
              return prev
            }
            const newEvents = [...prev]
            if (foundIndex > -1) {
              if (hasProgress) {
                newEvents[foundIndex] = mergeProgressEventParts(newEvents[foundIndex] as CollectProgressEvent, ev)
              } else {
                void queryClient.invalidateQueries({
                  predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace'),
                })
                newEvents.splice(foundIndex, 1)
              }
            } else if (hasProgress) {
              newEvents.unshift(ev)
            }
            return newEvents
          })
          break
        }
        case 'aws_account_configured':
          void queryClient.invalidateQueries({
            predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
          })
          void showSnackbar(t`Cloud account configured, id: ${ev.data.aws_account_id}`, { severity: 'success', autoHideDuration: null })
          break
        case 'aws_account_degraded':
          void queryClient.invalidateQueries({
            predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
          })
          void showSnackbar(t`Cloud account degraded, id: ${ev.data.aws_account_id}`, { severity: 'warning', autoHideDuration: null })
          break
        case 'aws_account_discovered':
          void queryClient.invalidateQueries({
            predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
          })
          void showSnackbar(t`Cloud account discovered, id: ${ev.data.aws_account_id}`, { severity: 'info' })
          break
        case 'collect-error':
          void queryClient.invalidateQueries({
            predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace'),
          })
          //   showSnackbar(t`Task "${ev.data.task}" with workflow "${ev.data.workflow}" failed: ${ev.data.message}`, {
          //     severity: 'error',
          //     autoHideDuration: null,
          //   })
          break
      }
    }
    return addListener('event-button', eventListener)
  }, [addListener, queryClient, send, showSnackbar])

  const hasNoEvents = !events.length

  useEffect(() => {
    if (!hasNoEvents) {
      setOpenEvents(false)
    }
  }, [hasNoEvents])

  const handleToggleUserMenu = () => {
    if (events.length && !openEvents) {
      setOpenEvents(true)
    } else {
      setOpenEvents(false)
    }
  }

  return hasNoEvents ? null : (
    <Box display="inline-flex" alignItems="center" justifyContent="center">
      <Tooltip title={t`Events`}>
        <IconButton sx={{ p: 0, color: 'white', mr: 2 }} size="large" onClick={handleToggleUserMenu} ref={anchorEl}>
          <Badge badgeContent={events.length} color="error">
            <EventIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>
      <PopperContainer
        id="event-menu"
        anchorEl={anchorEl.current}
        open={openEvents}
        transition
        placement="bottom-start"
        modifiers={[
          {
            name: 'arrow',
            enabled: true,
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={10}>
              <Box
                display="flex"
                flexDirection="column"
                height={!events.length ? '360px' : 'auto'}
                maxHeight="calc(100vh - 90px)"
                overflow="auto"
              >
                {events.map((data, i) => (
                  <EventItem key={i} data={data} />
                ))}
              </Box>
            </Paper>
          </Fade>
        )}
      </PopperContainer>
    </Box>
  )
}
