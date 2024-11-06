import { t } from '@lingui/macro'
import { TimelineDot } from '@mui/lab'
import { Stack, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid-premium'
import { AddCircleFilledIcon, DoNotDisturbOnIcon, GppMaybeFilledIcon, UpdateIcon, VerifiedUserFilledIcon } from 'src/assets/icons'
import { WorkspaceInventoryNodeHistoryChanges, WorkspaceInventorySearchTableRow } from 'src/shared/types/server'

export const nodeChangeToString = (change: WorkspaceInventoryNodeHistoryChanges) => {
  switch (change) {
    case 'node_created':
      return t`Resource created`
    case 'node_updated':
      return t`Configuration changed`
    case 'node_deleted':
      return t`Resource deleted`
    case 'node_vulnerable':
      return t`Security posture changed`
    case 'node_compliant':
      return t`Resource Secured`
  }
}

export const renderNodeChangeCell = (params: GridRenderCellParams<WorkspaceInventorySearchTableRow['row']>) => {
  const change = params.row.change as WorkspaceInventoryNodeHistoryChanges
  switch (change) {
    case 'node_created':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={nodeChangeToString(change)} arrow>
            <TimelineDot color="info" variant="outlined">
              <AddCircleFilledIcon width={20} height={20} />
            </TimelineDot>
          </Tooltip>
        </Stack>
      )
    case 'node_updated':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={nodeChangeToString(change)} arrow>
            <TimelineDot color="primary" variant="outlined">
              <UpdateIcon width={20} height={20} />
            </TimelineDot>
          </Tooltip>
        </Stack>
      )
    case 'node_deleted':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={nodeChangeToString(change)} arrow>
            <TimelineDot color="error" variant="outlined">
              <DoNotDisturbOnIcon width={20} height={20} />
            </TimelineDot>
          </Tooltip>
        </Stack>
      )
    case 'node_compliant':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={nodeChangeToString(change)} arrow>
            <TimelineDot color="success" variant="outlined">
              <VerifiedUserFilledIcon width={20} height={20} />
            </TimelineDot>
          </Tooltip>
        </Stack>
      )
    case 'node_vulnerable':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={nodeChangeToString(change)} arrow>
            <TimelineDot color="warning" variant="outlined">
              <GppMaybeFilledIcon width={20} height={20} />
            </TimelineDot>
          </Tooltip>
        </Stack>
      )
  }
}
