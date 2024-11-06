import { Trans } from '@lingui/macro'
import { TimelineDot } from '@mui/lab'
import { Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { AddCircleFilledIcon, DoNotDisturbOnIcon, UpdateIcon } from 'src/assets/icons'
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
                <AddCircleFilledIcon width={20} height={20} color="action" />
              </TimelineDot>
              <Typography variant="body2" fontWeight="bold">
                <Trans>Resources Created</Trans>
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
                <UpdateIcon width={20} height={20} color="action" />
              </TimelineDot>
              <Typography variant="body2" fontWeight="bold">
                <Trans>Resources Updated</Trans>
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
                <DoNotDisturbOnIcon width={20} height={20} color="action" />
              </TimelineDot>
              <Typography variant="body2" fontWeight="bold">
                <Trans>Resources Deleted</Trans>
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
