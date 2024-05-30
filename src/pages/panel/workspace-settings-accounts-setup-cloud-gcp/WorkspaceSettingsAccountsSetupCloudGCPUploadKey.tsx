import { Trans, t } from '@lingui/macro'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Alert, Box, CircularProgress, Collapse, Skeleton, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { Dropzone } from 'src/shared/dropzone'
import { PutWorkspaceCloudAccountGCPKeyErrorResponse } from 'src/shared/types/server'
import { getWorkspaceCloudAccountGCPKeyQuery } from './getWorkspaceCloudAccountGCPKey.query'
import { putWorkspaceCloudAccountGCPKeyMutation } from './putWorkspaceCloudAccountGCPKey.mutation'

interface WorkspaceSettingsAccountsSetupCloudGCPUploadKeyProps {
  isMobile: boolean
}

export const WorkspaceSettingsAccountsSetupCloudGCPUploadKey = ({ isMobile }: WorkspaceSettingsAccountsSetupCloudGCPUploadKeyProps) => {
  const [progress, setProgress] = useState(0)
  const { selectedWorkspace } = useUserProfile()
  const handleSetProgress = useRef<(progress?: number) => void>()
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['workspace-cloud-account-gcp-key-query', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountGCPKeyQuery,
  })
  const { mutate, isSuccess, error, isPending } = useMutation({
    mutationFn: putWorkspaceCloudAccountGCPKeyMutation,
    onSettled: () => {
      handleSetProgress.current = undefined
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-cloud-account-gcp-key-query',
      })
      setProgress(0)
    },
  })
  const handleChange = (file?: File) => {
    const workspaceId = selectedWorkspace?.id
    handleSetProgress.current = (progress?: number) => setProgress((progress ?? 0) * 100)
    if (workspaceId && file) {
      mutate({
        file,
        workspaceId,
        onUploadProgress: ({ progress }) => handleSetProgress.current?.(progress),
      })
    }
  }

  const errorMessage = (error as AxiosError<PutWorkspaceCloudAccountGCPKeyErrorResponse>)?.response?.data

  return selectedWorkspace?.id && data ? (
    <Dropzone onChange={handleChange} mimeType={['application/JSON']} isPending={isPending} disabled={isSuccess} minHeight={300} flex={1}>
      <Stack p={1} alignItems="center" gap={1}>
        <Collapse in={!isSuccess}>
          <Stack direction="row" gap={1} alignItems="center">
            {isPending ? (
              <Typography variant="h4" textAlign="center">
                <Trans>Uploading your Google Cloud Service Account file...</Trans>
              </Typography>
            ) : data.can_access_sa ? (
              <Typography variant="h4" textAlign="center">
                <Trans>A Google Cloud Service Account is connected to this workspace. Drop file to replace it.</Trans>
              </Typography>
            ) : data.can_access_sa === null ? (
              <Typography variant="h5" textAlign="center">
                <Trans>
                  A Google Cloud Service Account key file has been uploaded - we are currently trying to list your projects. Please stay
                  tuned - we will send you an Email when cloud accounts have been collected.
                </Trans>
              </Typography>
            ) : (
              <Typography variant="h4" textAlign="center">
                <Trans>Click or Drop your Google Cloud Service Account file here</Trans>
              </Typography>
            )}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant={progress === 100 ? 'indeterminate' : 'determinate'} value={progress} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloudUploadIcon fontSize="small" />
              </Box>
            </Box>
          </Stack>
        </Collapse>
        <Collapse in={!!error}>
          <Alert variant="outlined" severity="error" sx={{ pointerEvents: 'all', cursor: 'initial' }} onClick={(e) => e.stopPropagation()}>
            <Typography textAlign="center">
              {errorMessage?.status_code === 422 ? (
                <Trans>
                  The Google Cloud Service Account key file is valid but did not allow us to list available projects.
                  <br />
                  It is important to ensure that it has the necessary permissions and that the required APIs are enabled to avoid this
                  error.
                  <br />
                  The following message was created by GCP when we tried to list the projects:
                  <br />
                  {errorMessage.detail}
                </Trans>
              ) : (
                <Trans>Invalid file, Please follow the step-by-step instructions {isMobile ? t`above` : t`on the right side`}.</Trans>
              )}
            </Typography>
          </Alert>
        </Collapse>
        <Collapse in={!!isSuccess}>
          <Alert variant="outlined" severity="success">
            <Typography textAlign="center" fontSize={18}>
              <Trans>
                The Google Cloud Service Account has been updated successfully.
                <br />
                We will process the file and add the accounts that we find.
                <br />
                This process may take a <u>few minutes</u>.
                <br />
                We will send you an email once the projects are ready.
              </Trans>
            </Typography>
          </Alert>
        </Collapse>
      </Stack>
    </Dropzone>
  ) : (
    <Skeleton height="100%" width="100%" />
  )
}
