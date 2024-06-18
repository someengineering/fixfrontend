import { Trans, t } from '@lingui/macro'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { panelUI, settingsStorageKeys } from 'src/shared/constants'
import { TableView } from 'src/shared/layouts/panel-layout'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { BillingEntryRow } from './BillingEntryRow'
import { getWorkspaceBillingEntriesQuery } from './getWorkspaceBillingEntires.query'

export const WorkspaceSettingsBillingTable = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-billing-entries', selectedWorkspace?.id],
    queryFn: getWorkspaceBillingEntriesQuery,
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState(
    settingsStorageKeys.WorkspaceSettingsBillingTable.rowsPerPage,
    panelUI.tableRowsPerPages[0] as number,
    (state) => (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  return (
    <>
      <Typography variant="h4">
        <Trans>Billing history</Trans>
      </Typography>
      <TableView
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          rowsPerPage,
          setPage,
          setRowsPerPage,
          id: 'WorkspaceSettingsBillingTable',
        }}
        minHeight={panelUI.tableViewMinHeight}
        stickyPagination
      >
        <Table stickyHeader aria-label={t`Receipts`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Date</Trans>
              </TableCell>
              <TableCell>
                <Trans>Tier</Trans>
              </TableCell>
              <TableCell>
                <Trans>Number Of Account Charged</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((billingEntry, i) => <BillingEntryRow billingEntry={billingEntry} key={`${billingEntry.id}_${i}`} />)}
          </TableBody>
        </Table>
      </TableView>
    </>
  )
}
