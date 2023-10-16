import { Alert, AlertProps, Box, Typography } from '@mui/material'
import { WebSocketEvent } from 'src/shared/types/server'
import { EventCollectProgressItem } from './EventCollectProgressItem'

interface EventItemProps {
  data: WebSocketEvent
}

const getSeverity = (kind: WebSocketEvent['kind']): AlertProps['severity'] => {
  switch (kind) {
    case 'cloud_account_created':
      return 'success'
    case 'collect-progress':
      return 'info'
    case 'collect-error':
      return 'error'
  }
}
const renderData = (data: WebSocketEvent) => {
  switch (data.kind) {
    case 'collect-progress':
      return <EventCollectProgressItem data={data} />
  }
  return null
}

export const EventItem = ({ data }: EventItemProps) => {
  return (
    <Box width="100%" p={1}>
      <Alert variant="outlined" severity={getSeverity(data.kind)} sx={{ '.MuiAlert-message': { flexGrow: 1 } }}>
        <Box display="flex" flexDirection="column" my={1} width="100%" flexGrow={1}>
          <Box display="flex" justifyContent="space-between" pb={2}>
            <Typography variant="caption" pr={2}>
              {data.publisher}
            </Typography>
            <Typography variant="caption" pl={2}>
              {new Date(data.at).toLocaleString()}
            </Typography>
          </Box>
          {renderData(data)}
        </Box>
      </Alert>
    </Box>
  )
}
