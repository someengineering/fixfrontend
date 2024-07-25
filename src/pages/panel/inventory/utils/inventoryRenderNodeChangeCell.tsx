import { Trans } from '@lingui/macro'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import UpdateIcon from '@mui/icons-material/Update'
import { TimelineDot } from '@mui/lab'
import { Stack } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid-premium'
import { WorkspaceInventoryNodeHistoryChanges, WorkspaceInventorySearchTableRow } from 'src/shared/types/server'

export const inventoryRenderNodeChangeCell = (params: GridRenderCellParams<WorkspaceInventorySearchTableRow['row']>) => {
  const change = params.row.change as WorkspaceInventoryNodeHistoryChanges
  switch (change) {
    case 'node_created':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineDot color="info" variant="outlined">
            <AddCircleIcon fontSize="small" />
          </TimelineDot>
          <span>
            <Trans>Resource created</Trans>
          </span>
        </Stack>
      )
    case 'node_updated':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineDot color="primary" variant="outlined">
            <UpdateIcon fontSize="small" />
          </TimelineDot>
          <span>
            <Trans>Configuration changed</Trans>
          </span>
        </Stack>
      )
    case 'node_deleted':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineDot color="error" variant="outlined">
            <DeleteIcon fontSize="small" />
          </TimelineDot>
          <span>
            <Trans>Resource deleted</Trans>
          </span>
        </Stack>
      )
    case 'node_compliant':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineDot color="success" variant="outlined">
            <GppGoodIcon fontSize="small" />
          </TimelineDot>
          <span>
            <Trans>Resource Secured</Trans>
          </span>
        </Stack>
      )
    case 'node_vulnerable':
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineDot color="warning" variant="outlined">
            <GppMaybeIcon fontSize="small" />
          </TimelineDot>
          <span>
            <Trans>Security posture changed</Trans>
          </span>
        </Stack>
      )
  }
}
