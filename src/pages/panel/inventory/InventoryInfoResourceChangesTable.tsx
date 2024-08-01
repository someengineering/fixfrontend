import { Trans } from '@lingui/macro'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import UpdateIcon from '@mui/icons-material/Update'
import { TimelineDot } from '@mui/lab'
import { Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { InternalLink } from 'src/shared/link-button'
import { mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'

interface InventoryInfoResourceChangesTableProps {
  changes: [number, number, number]
  startDate: string
  endDate: string
}

export const InventoryInfoResourceChangesTable = ({ changes, endDate, startDate }: InventoryInfoResourceChangesTableProps) => (
  <Table sx={{ width: 'auto' }}>
    <TableBody>
      <TableRow>
        <TableCell>
          <InternalLink
            to={{
              pathname: '/inventory/history',
              search: mergeLocationSearchValues({
                changes: 'node_created',
                after: startDate,
                before: endDate,
              }),
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TimelineDot color="info" variant="outlined">
                <AddCircleIcon fontSize="small" color="action" />
              </TimelineDot>
              <Typography variant="body2" fontWeight="bold">
                <Trans>New Resources Created</Trans>
              </Typography>
            </Stack>
          </InternalLink>
        </TableCell>
        <TableCell>
          <Trans>{changes[0]}</Trans>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <InternalLink
            to={{
              pathname: '/inventory/history',
              search: mergeLocationSearchValues({
                changes: 'node_updated',
                after: startDate,
                before: endDate,
              }),
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TimelineDot color="primary" variant="outlined">
                <UpdateIcon fontSize="small" color="action" />
              </TimelineDot>
              <Typography variant="body2" fontWeight="bold">
                <Trans>Existing Resources Updated</Trans>
              </Typography>
            </Stack>
          </InternalLink>
        </TableCell>
        <TableCell>
          <Trans>{changes[1]}</Trans>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ borderBottom: 'none' }}>
          <InternalLink
            to={{
              pathname: '/inventory/history',
              search: mergeLocationSearchValues({
                changes: 'node_deleted',
                after: startDate,
                before: endDate,
              }),
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TimelineDot color="error" variant="outlined">
                <RemoveCircleIcon fontSize="small" color="action" />
              </TimelineDot>
              <Typography variant="body2" fontWeight="bold">
                <Trans>Existing Resources Deleted</Trans>
              </Typography>
            </Stack>
          </InternalLink>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <Trans>{changes[2]}</Trans>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
)
