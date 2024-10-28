import { Trans, plural, t } from '@lingui/macro'
import { Button, Checkbox, Collapse, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceProductTiersQuery, getWorkspaceUsersQuery } from 'src/pages/panel/shared/queries'
import { panelUI, settingsStorageKeys } from 'src/shared/constants'
import { TableView } from 'src/shared/layouts/panel-layout'
import { ButtonsRegion } from 'src/shared/layouts/panel-settings-layout'
import { GetWorkspaceProductTiersResponse } from 'src/shared/types/server'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { DeleteInvitedExternalUserMenuItem } from './DeleteInvitedExternalUserMenuItem'
import { InviteExternalUser } from './InviteExternalUser'
import { WorkspaceUsersSettingsRow } from './WorkspaceUsersSettingsRow'

export default function WorkspaceUsersSettingsPage() {
  const { selectedWorkspace, checkPermissions } = useUserProfile()
  const [hasInvitePermission, hasRemoveUserPermission, hasReadRolesPermission] = checkPermissions('inviteTo', 'removeFrom', 'readRoles')
  const [{ data }, { data: currentTier }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['workspace-users', selectedWorkspace?.id],
        queryFn: getWorkspaceUsersQuery,
      },
      {
        queryFn: getWorkspaceProductTiersQuery,
        queryKey: ['workspace-product-tiers', selectedWorkspace?.id],
        select: (data: GetWorkspaceProductTiersResponse) => (selectedWorkspace?.tier ? data[selectedWorkspace.tier] : undefined),
      },
    ],
  })

  const canInviteBasedOnTier = (currentTier?.seats_max ?? Number.POSITIVE_INFINITY) > data.length

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState<number>(
    settingsStorageKeys.WorkspaceSettingsUsersTable.rowsPerPage,
    panelUI.tableRowsPerPages[0],
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  const isAll = selectedRows.length === data.length
  return (
    <>
      <ButtonsRegion>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {hasInvitePermission && canInviteBasedOnTier ? <InviteExternalUser /> : null}
          <Collapse in={!!selectedRows.length} orientation="horizontal">
            <DeleteInvitedExternalUserMenuItem
              workspaceUserIds={selectedRows}
              ButtonComp={Button}
              deleteConfirmText={
                isAll ? (
                  <Trans>Do you want to delete all users?</Trans>
                ) : (
                  plural(selectedRows.length, { one: 'Do you want to delete this user', other: 'Do you want to delete # users' })
                )
              }
              onClose={(finished) => (finished ? setSelectedRows([]) : undefined)}
              buttonProps={
                {
                  color: 'error',
                  variant: 'outlined',
                  sx: { whiteSpace: 'nowrap' },
                  children: isAll ? (
                    <Trans>Delete All</Trans>
                  ) : (
                    plural(selectedRows.length, { one: 'Delete User', other: 'Delete # Users' })
                  ),
                } as const
              }
            />
          </Collapse>
        </Stack>
      </ButtonsRegion>
      <TableView
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          pages: [...panelUI.tableRowsPerPages],
          rowsPerPage,
          setPage,
          setRowsPerPage,
          id: 'WorkspaceSettingsUsersTable',
        }}
        minHeight={200}
        stickyPagination
      >
        <Table stickyHeader aria-label={t`Workspace Users`}>
          <TableHead>
            <TableRow>
              <TableCell width={42} sx={{ p: 0 }}>
                <Checkbox
                  checked={selectedRows.length === data.length}
                  indeterminate={!!selectedRows.length && selectedRows.length !== data.length}
                  onChange={(_, checked) => (checked ? setSelectedRows(data.map((i) => i.id)) : setSelectedRows([]))}
                  sx={{ p: 0 }}
                />
              </TableCell>
              <TableCell>
                <Trans>Sources</Trans>
              </TableCell>
              <TableCell>
                <Trans>Name & Email</Trans>
              </TableCell>
              {hasReadRolesPermission ? (
                <TableCell>
                  <Trans>Roles</Trans>
                </TableCell>
              ) : null}
              <TableCell>
                <Trans>Last login</Trans>
              </TableCell>
              <TableCell>
                <Trans>Invites</Trans>
              </TableCell>
              {hasRemoveUserPermission ? <TableCell /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((workspaceUser, i) => (
              <WorkspaceUsersSettingsRow
                workspaceUser={workspaceUser}
                key={`${workspaceUser.id}_${workspaceUser.email}_${i}`}
                selected={selectedRows.includes(workspaceUser.id)}
                onSelect={(selected, row) =>
                  setSelectedRows((prev) => {
                    if (selected) {
                      return [...prev, row.id]
                    } else {
                      const foundIndex = prev.findIndex((id) => id === row.id)
                      if (foundIndex > -1) {
                        const result = [...prev]
                        result.splice(foundIndex, 1)
                        return result
                      }
                    }
                    return prev
                  })
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableView>
    </>
  )
}
