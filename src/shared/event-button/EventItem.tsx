import { Alert, AlertProps, Box, Typography, alertClasses } from '@mui/material'
import { WebSocketEvent } from 'src/shared/types/server'
import { EventCollectProgressItem } from './EventCollectProgressItem'

interface EventItemProps {
  data: WebSocketEvent
}

const getSeverity = (kind: WebSocketEvent['kind']): AlertProps['severity'] => {
  switch (kind) {
    case 'aws_account_configured':
      return 'success'
    case 'aws_account_degraded':
      return 'warning'
    case 'aws_account_discovered':
    case 'collect-progress':
      return 'info'
    case 'aws_account_deleted':
    case 'collect-error':
      return 'error'
  }
}
const renderData = (data: WebSocketEvent) => {
  switch (data.kind) {
    // case 'cloud_account_created':
    //   return (
    //     <>
    //       <Typography variant="h4" mb={1} textAlign="center">
    //         <Trans>Account created!</Trans>
    //       </Typography>
    //       <Box display="flex" mb={1}>
    //         <Typography variant="caption" mr={1}>
    //           <Trans>Cloud id:</Trans>
    //         </Typography>
    //         <Typography variant="caption">{data.data.cloud_account_id}</Typography>
    //       </Box>
    //       <Box display="flex" mb={1}>
    //         <Typography variant="caption" mr={1}>
    //           <Trans>AWS id:</Trans>
    //         </Typography>
    //         <Typography variant="caption">{data.data.aws_account_id}</Typography>
    //       </Box>
    //       <Box display="flex">
    //         <Typography variant="caption" mr={1}>
    //           <Trans>Workspace id:</Trans>
    //         </Typography>
    //         <Typography variant="caption">{data.data.workspace_id}</Typography>
    //       </Box>
    //     </>
    //   )
    // case 'collect-error':
    //   return (
    //     <>
    //       <Typography variant="h4" mb={1} textAlign="center">
    //         <Trans>An error occurred!</Trans>
    //       </Typography>
    //       <Typography variant="body1" mb={1}>
    //         {data.data.message}
    //       </Typography>
    //       <Box display="flex" mb={1}>
    //         <Typography variant="caption" mr={1}>
    //           <Trans>Task:</Trans>
    //         </Typography>
    //         <Typography variant="caption">{data.data.task}</Typography>
    //       </Box>
    //       <Box display="flex">
    //         <Typography variant="caption" mr={1}>
    //           <Trans>Workflow:</Trans>
    //         </Typography>
    //         <Typography variant="caption">{data.data.workflow}</Typography>
    //       </Box>
    //     </>
    //   )
    case 'collect-progress':
      return <EventCollectProgressItem data={data} />
  }
  return null
}

export const EventItem = ({ data }: EventItemProps) => {
  return (
    <Box width="100%" p={1}>
      <Alert variant="outlined" severity={getSeverity(data.kind)} sx={{ [`.${alertClasses.message}`]: { flexGrow: 1 } }}>
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
