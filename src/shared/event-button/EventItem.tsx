import { useLingui } from '@lingui/react'
import { Alert, AlertProps, Box, Typography, alertClasses } from '@mui/material'
import { CollectProgressEvent, WebSocketEvent } from 'src/shared/types/server'
import { EventCollectProgressItem } from './EventCollectProgressItem'

interface EventItemProps {
  data: CollectProgressEvent[]
}

const getSeverity = (kind: WebSocketEvent['kind']): AlertProps['severity'] => {
  // TODO: remove aws specific events
  switch (kind) {
    case 'cloud_account_configured':
    case 'aws_account_configured':
      return 'success'
    case 'cloud_account_degraded':
    case 'aws_account_degraded':
      return 'warning'
    case 'cloud_account_discovered':
    case 'aws_account_discovered':
    case 'collect-progress':
      return 'info'
    case 'cloud_account_deleted':
    case 'aws_account_deleted':
    case 'collect-error':
      return 'error'
  }
}
// const renderData = (data: WebSocketEvent) => {
//   switch (data.kind) {
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
//     case 'collect-progress':
//       return <EventCollectProgressItem data={data} />
//   }
//   return null
// }

export const EventItem = ({ data }: EventItemProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  return (
    <Box width="100%" p={1}>
      <Alert variant="outlined" severity={getSeverity('collect-progress')} sx={{ [`.${alertClasses.message}`]: { flexGrow: 1 } }}>
        <Box display="flex" flexDirection="column" my={1} width="100%" flexGrow={1}>
          <Box display="flex" justifyContent="space-between" pb={2}>
            <Typography variant="caption" pl={2}>
              {new Date(data[0].at).toLocaleString(locale)}
            </Typography>
          </Box>
          <EventCollectProgressItem parts={data.map((ev) => ev.data.message.parts).flat()} />
        </Box>
      </Alert>
    </Box>
  )
}
