import { Trans, t } from '@lingui/macro'
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { AddExternalDirectory } from './AddExternalDirectory'

export default function WorkspaceSettingsExternalDirectoryPage() {
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" spacing={1} mb={2}>
        <Typography variant="h3">
          <Trans>External Directories</Trans>
        </Typography>
        <AddExternalDirectory />
      </Stack>
      <TableViewPage>
        <Table stickyHeader aria-label={t`External Directories`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Name</Trans>
              </TableCell>
              <TableCell>
                <Trans>Type</Trans>
              </TableCell>
              <TableCell>
                <Trans>Description</Trans>
              </TableCell>
              <TableCell>
                <Trans>Users</Trans>
              </TableCell>
              <TableCell>
                <Trans>Next Sync</Trans>
              </TableCell>
              <TableCell>
                <Trans>Default Role</Trans>
              </TableCell>
              <TableCell>
                <Trans>Action</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableViewPage>
    </Stack>
  )
}
