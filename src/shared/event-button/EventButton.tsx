import { t } from '@lingui/macro'
import EventIcon from '@mui/icons-material/Event'
import { Badge, Box, Fade, IconButton, Paper, Popper, Tooltip, styled } from '@mui/material'
import { MouseEvent as MouseEventReact, useEffect, useState } from 'react'
import { useEvents } from 'src/core/events'
import { WebSocketEvent } from 'src/shared/types/server'
import { EventItem } from './EventItem'

const PopperContainer = styled(Popper)(({ theme }) => ({
  marginTop: 45,
  zIndex: theme.zIndex.tooltip,
}))

export const EventButton = () => {
  const [anchorElEvent, setAnchorElEvent] = useState<HTMLElement>()
  const { addListener, send } = useEvents()
  const [events, setEvents] = useState<WebSocketEvent[]>([])

  useEffect(() => {
    const removeListener = addListener('event-button', (ev) => {
      if (ev.kind === 'collect-progress') {
        setEvents((prev) => {
          const newEvents = [...prev]
          const foundIndex = newEvents.findIndex((item) => item.kind === ev.kind && item.data.task === ev.data.task)
          if (foundIndex > -1) {
            newEvents[foundIndex] = ev
          } else {
            newEvents.unshift(ev)
          }
          return newEvents
        })
      }
    })

    return removeListener
  }, [addListener, send])

  const handleToggleUserMenu = (event: MouseEventReact<HTMLElement, MouseEvent>) => {
    if (events.length && !anchorElEvent) {
      setAnchorElEvent(event.currentTarget)
    } else {
      setAnchorElEvent(undefined)
    }
  }

  return (
    <Box display="inline-flex" alignItems="center" justifyContent="center">
      <Tooltip title={t`Events`}>
        <IconButton sx={{ p: 0, color: 'white', mr: 2 }} size="large" onClick={handleToggleUserMenu}>
          <Badge badgeContent={events.length} color="primary">
            <EventIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>
      <PopperContainer
        id="event-menu"
        anchorEl={anchorElEvent}
        open={Boolean(anchorElEvent)}
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
