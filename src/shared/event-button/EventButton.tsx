import { t } from '@lingui/macro'
import EventIcon from '@mui/icons-material/Event'
import { Badge, Box, Fade, IconButton, Paper, Popper, Tooltip, styled } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useEvents } from 'src/core/events'
import { useSnackbar } from 'src/core/snackbar'
import { WebSocketEvent } from 'src/shared/types/server'
import { EventItem } from './EventItem'

const PopperContainer = styled(Popper)(({ theme }) => ({
  marginTop: 45,
  zIndex: theme.zIndex.tooltip,
}))

export const EventButton = () => {
  const [openEvents, setOpenEvents] = useState(false)
  const anchorEl = useRef<HTMLButtonElement>(null)
  const { showSnackbar } = useSnackbar()
  const { addListener, send } = useEvents()
  const [events, setEvents] = useState<WebSocketEvent[]>([])

  useEffect(() => {
    const eventListener = (ev: WebSocketEvent) => {
      switch (ev.kind) {
        case 'collect-progress':
          const hasProgress = ev.data.message.parts.find((i) => i.current !== i.total)
          setEvents((prev) => {
            const foundIndex = prev.findIndex((item) => item.kind === ev.kind && item.data.task === ev.data.task)
            if (foundIndex === -1 && !hasProgress) {
              return prev
            }
            const newEvents = [...prev]
            if (foundIndex > -1) {
              if (hasProgress) {
                newEvents[foundIndex] = ev
              } else {
                newEvents.splice(foundIndex, 1)
              }
            } else if (hasProgress) {
              newEvents.unshift(ev)
            }
            return newEvents
          })
          break
        case 'cloud_account_created':
          showSnackbar(t`Cloud account created, id: ${ev.data.aws_account_id}`, { severity: 'success', autoHideDuration: null })
          break
        // case 'collect-error':
        //   showSnackbar(t`Task "${ev.data.task}" with workflow "${ev.data.workflow}" failed: ${ev.data.message}`, {
        //     severity: 'error',
        //     autoHideDuration: null,
        //   })
        //   break
      }
    }
    const removeListener = addListener('event-button', eventListener)

    return removeListener
  }, [addListener, send, showSnackbar])

  const hasNoEvents = !events.length

  useEffect(() => {
    setOpenEvents(!hasNoEvents)
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
