import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import { Button, Grid, IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { Modal } from 'src/shared/modal'
import { WorkspaceUser } from 'src/shared/types/server'
import { WorkspaceSettingsUserRoles } from './WorkspaceSettingsUserRoles'
import { deleteWorkspaceUserMutation } from './deleteWorkspaceUser.mutation'
import { workspaceSettingsUserRoleToString } from './workspaceSettingsUserRoleToString'

interface WorkspaceSettingsUserRowProps {
  workspaceUser: WorkspaceUser
}

export const WorkspaceSettingsUserRow = ({ workspaceUser }: WorkspaceSettingsUserRowProps) => {
  const showDeleteModalRef = useRef<(show?: boolean) => void>()
  const {
    i18n: { locale },
  } = useLingui()
  const { selectedWorkspace, checkPermissions } = useUserProfile()
  const [hasRemoveUserPermission, hasReadRolesPermission] = checkPermissions('removeFrom', 'readRoles')
  const queryClient = useQueryClient()

  const { mutate: deleteWorkspaceUser, isPending: deleteWorkspaceUserIsPending } = useMutation({
    mutationFn: deleteWorkspaceUserMutation,
  })

  const handleDeleteModal = () => {
    if (showDeleteModalRef.current && hasRemoveUserPermission) {
      showDeleteModalRef.current()
    }
  }

  const handleDelete = () => {
    if (selectedWorkspace?.id && hasRemoveUserPermission) {
      deleteWorkspaceUser(
        { workspaceId: selectedWorkspace.id, userId: workspaceUser.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(['workspace-users', selectedWorkspace?.id], (oldData: WorkspaceUser[]) => {
              const foundIndex = oldData.findIndex((item) => item.id === workspaceUser.id)
              if (foundIndex > -1) {
                const newData = [...oldData]
                newData.splice(foundIndex, 1)
                return newData
              }
              return oldData
            })
          },
          onError: () => {
            void queryClient.invalidateQueries({
              queryKey: ['workspace-users'],
            })
          },
          onSettled: () => {
            showDeleteModalRef.current?.(false)
          },
        },
      )
    }
  }
  return (
    <TableRow>
      <TableCell>
        {workspaceUser.sources.length ? (
          <Grid container spacing={1} minWidth={workspaceUser.sources.length > 1 ? 100 : undefined}>
            {workspaceUser.sources.map(({ source }) => (
              <Grid item key={source}>
                <CloudAvatar cloud={source} />
              </Grid>
            ))}
          </Grid>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>{workspaceUser.name || '-'}</TableCell>
      <TableCell>{workspaceUser.email || '-'}</TableCell>
      {hasReadRolesPermission ? (
        <TableCell>
          <WorkspaceSettingsUserRoles role={workspaceUser.roles} userId={workspaceUser.id} />
        </TableCell>
      ) : null}
      <TableCell>{workspaceUser.last_login ? new Date(workspaceUser.last_login).toLocaleString(locale) : '-'}</TableCell>
      <TableCell>-</TableCell>
      {hasRemoveUserPermission ? (
        <>
          <TableCell>
            {deleteWorkspaceUserIsPending ? (
              <IconButton aria-label={t`Delete`} disabled>
                <DeleteIcon />
              </IconButton>
            ) : (
              <Tooltip title={<Trans>Delete</Trans>}>
                <IconButton aria-label={t`Delete`} color="error" onClick={handleDeleteModal}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </TableCell>
          <Modal
            title={<Trans>Are you sure?</Trans>}
            description={
              <>
                <Trans>Do you want to delete this user?</Trans>
              </>
            }
            openRef={showDeleteModalRef}
            actions={
              <>
                {deleteWorkspaceUserIsPending ? null : (
                  <Button color="primary" variant="contained" onClick={() => showDeleteModalRef.current?.(false)}>
                    <Trans>Cancel</Trans>
                  </Button>
                )}
                <LoadingButton
                  loadingPosition={deleteWorkspaceUserIsPending ? 'start' : undefined}
                  startIcon={<DeleteIcon />}
                  loading={deleteWorkspaceUserIsPending}
                  color="error"
                  variant="outlined"
                  onClick={handleDelete}
                >
                  <Trans>Delete</Trans>
                </LoadingButton>
              </>
            }
          >
            <Typography>
              <Trans>Email</Trans>: {workspaceUser.email}
            </Typography>
            <Typography>
              <Trans>Name</Trans>: {workspaceUser.name}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" display="inline-flex" alignItems="center">
              <Typography>
                <Trans>Sources</Trans>:{' '}
              </Typography>
              {workspaceUser.sources.map(({ source }, i) => (
                <CloudAvatar key={i} cloud={source} />
              ))}
            </Stack>
            <Typography>
              <Trans>Roles</Trans>: {workspaceSettingsUserRoleToString(workspaceUser.roles)}
            </Typography>
          </Modal>
        </>
      ) : null}
    </TableRow>
  )
}
