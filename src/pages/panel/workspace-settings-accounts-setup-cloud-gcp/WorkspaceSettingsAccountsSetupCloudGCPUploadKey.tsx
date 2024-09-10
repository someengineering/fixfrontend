import { Trans, t } from '@lingui/macro'
import { Alert, AlertTitle, Box, CircularProgress, Collapse, Divider, Skeleton, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { panelUI } from 'src/shared/constants'
import { Dropzone } from 'src/shared/dropzone'
import { PutWorkspaceCloudAccountGCPKeyErrorResponse } from 'src/shared/types/server'
import { extractAndSplitUrlFromText } from 'src/shared/utils/extractAndSplitUrlFromText'
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
    queryKey: ['workspace-cloud-account-gcp-key', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountGCPKeyQuery,
  })
  const { mutate, isSuccess, error, isPending } = useMutation({
    mutationFn: putWorkspaceCloudAccountGCPKeyMutation,
    onSettled: () => {
      handleSetProgress.current = undefined
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-cloud-account-gcp-key',
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

  const errorResponse = (error as AxiosError<PutWorkspaceCloudAccountGCPKeyErrorResponse>)?.response
  const errorMessageDetail = errorResponse?.data?.detail

  return selectedWorkspace?.id && data ? (
    <Dropzone
      onChange={handleChange}
      mimeType={['application/JSON']}
      isPending={isPending}
      disabled={isSuccess}
      minHeight={300}
      flex={0.5}
      width="100%"
      borderRadius="12px"
      sx={{ border: `2px dashed ${panelUI.uiThemePalette.primary.divider}` }}
    >
      <Stack p={1} alignItems="center" gap={{ xs: 3.75, md: 5 }}>
        <svg width="202" height="161" viewBox="0 0 202 161" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="154.11" cy="47.767" r="47.267" fill="#F1E8FC" stroke="#111827" />
          <mask id="mask0_4386_3402" maskUnits="userSpaceOnUse" x="131" y="16" width="48" height="49">
            <rect x="131.025" y="16.9893" width="47.767" height="47.767" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_4386_3402)">
            <path
              d="M154.067 48.0962V30.204L149.178 35.0673L147.97 33.8786L154.909 26.9404L161.847 33.8786L160.64 35.0673L155.751 30.204V48.0962H154.067ZM143.885 54.8045C143.07 54.8045 142.381 54.5236 141.819 53.9616C141.258 53.3997 140.977 52.7111 140.977 51.8957V46.7185H142.661V51.8957C142.661 52.2019 142.788 52.4825 143.043 52.7376C143.299 52.9927 143.579 53.1202 143.885 53.1202H165.932C166.238 53.1202 166.519 52.9927 166.774 52.7376C167.029 52.4825 167.156 52.2019 167.156 51.8957V46.7185H168.841V51.8957C168.841 52.7111 168.56 53.3997 167.998 53.9616C167.436 54.5236 166.747 54.8045 165.932 54.8045H143.885Z"
              fill="#1C1B1F"
            />
          </g>
          <path
            d="M133.044 65.3032C126.319 53.0027 113.764 43.7345 99.9477 41.2154C84.4143 38.3778 70.7333 45.3628 60.3265 56.5483C58.8221 58.1648 56.5803 58.855 54.4388 58.3005C46.0791 56.153 25.1063 53.1384 21.9442 75.7454C21.661 77.7512 20.1271 79.4149 18.1154 79.6449C15.7261 79.9163 12.676 81.0844 10.8885 84.9132C9.12451 88.6948 10.3634 92.3348 13.2011 94.73C15.6317 96.7831 15.8618 100.447 13.4843 102.559C11.4902 104.329 9.74986 106.275 8.50507 107.921C-0.715893 120.127 -3.91934 151.088 14.6111 157.058C21.6551 159.33 29.7021 156.758 36.2033 153.944C36.7638 153.702 40.3743 151.542 43.3949 149.832C45.7842 148.475 48.6867 148.427 51.1114 149.725C60.9282 154.976 71.8896 158.274 82.9394 159.542C94.1131 160.828 105.181 159.318 115.906 156.103C121.404 154.451 126.69 151.755 132.2 150.274C137.162 148.941 138.719 150.823 143.421 152.392C151.734 155.159 162.158 157.483 170.772 153.873C183.52 148.528 187.101 133.112 186.323 120.605C185.414 105.98 179.928 94.146 166.506 87.7981C164.955 87.0606 163.84 85.6507 163.509 83.9634C162.27 77.6568 157.439 63.2974 139.522 68.0819C136.979 68.7603 134.312 67.6099 133.05 65.2973L133.044 65.3032Z"
            fill="white"
            stroke="#111827"
            stroke-miterlimit="10"
          />
          <path
            d="M91.1632 108.747C97.1807 109.744 103.316 109.237 109.287 108.028C110.431 107.798 111.517 108.564 111.717 109.715C112.313 113.101 111.735 116.924 109.835 120.452C105.906 127.75 97.812 131 91.7591 127.714C88.7621 126.086 86.8271 123.089 86.125 119.797C85.5351 117.048 85.1044 112.228 87.1338 109.951C87.4878 109.556 89.0925 108.334 89.6883 108.464C90.178 108.57 90.6676 108.665 91.1691 108.747H91.1632Z"
            fill="#EBDCFF"
          />
          <path
            d="M149.822 107.52C144.82 108.423 139.711 108.075 134.72 107.137C133.764 106.96 132.873 107.615 132.714 108.57C132.259 111.396 132.785 114.576 134.407 117.49C137.764 123.52 144.548 126.133 149.551 123.319C152.029 121.927 153.604 119.408 154.153 116.659C154.607 114.364 154.914 110.346 153.191 108.47C152.89 108.146 151.539 107.149 151.049 107.267C150.642 107.361 150.235 107.444 149.822 107.52Z"
            fill="#EBDCFF"
          />
          <path
            d="M111.697 111.252C109.203 110.813 107.008 110.347 104.843 110.045C102.695 109.736 100.623 109.566 98.5864 109.561C96.5498 109.561 94.5483 109.719 92.5066 110.08C90.4529 110.435 88.3957 111.026 86.0195 111.782L85.8327 111.842C84.5365 112.253 83.1889 111.527 82.8246 110.223C82.6358 109.551 82.7528 108.844 83.0811 108.272C84.6233 105.609 87.0997 103.498 89.8901 102.096C92.6924 100.693 95.8208 100.012 98.8729 100.017C101.931 100.022 104.912 100.698 107.576 101.933C110.235 103.18 112.611 104.951 114.311 107.323C115.093 108.418 114.84 109.973 113.742 110.802C113.172 111.235 112.481 111.384 111.84 111.276L111.691 111.252L111.697 111.252Z"
            fill="#7640EB"
          />
          <path
            d="M131.811 112.505C134.046 111.948 136.01 111.384 137.95 110.974C139.877 110.558 141.75 110.274 143.599 110.139C145.448 110.009 147.273 110.028 149.145 110.229C151.029 110.423 152.933 110.828 155.141 111.359L155.314 111.4C156.516 111.689 157.689 110.946 157.942 109.744C158.074 109.12 157.922 108.488 157.586 107.992C156.017 105.673 153.636 103.915 151.012 102.82C148.376 101.725 145.499 101.306 142.731 101.503C139.958 101.701 137.294 102.508 134.954 103.794C132.62 105.091 130.58 106.851 129.183 109.113C128.541 110.151 128.873 111.55 129.918 112.234C130.462 112.593 131.097 112.683 131.67 112.545L131.805 112.511L131.811 112.505Z"
            fill="#7640EB"
          />
          <path
            d="M137.138 127.968C135.887 128.133 134.784 128.41 133.646 128.64C132.525 128.888 131.404 129.1 130.301 129.295C129.191 129.472 128.094 129.637 127.009 129.726C126.466 129.755 125.923 129.791 125.386 129.802C125.115 129.814 124.849 129.814 124.584 129.802L123.711 129.785C121.534 129.773 119.263 129.496 117.068 129.183C114.867 128.853 112.637 128.457 110.696 127.661L110.632 127.631C110.23 127.466 109.764 127.661 109.599 128.062C109.475 128.369 109.552 128.705 109.776 128.923C110.726 129.855 111.853 130.475 112.98 130.982C114.112 131.49 115.28 131.861 116.454 132.18C117.634 132.469 118.826 132.717 120.029 132.858C120.631 132.935 121.233 133.006 121.841 133.041L122.295 133.065C122.478 133.077 122.667 133.077 122.808 133.077H123.687L124.56 133.083C124.879 133.083 125.197 133.083 125.51 133.059C126.141 133.041 126.761 132.965 127.374 132.882C128.601 132.705 129.799 132.439 130.961 132.097C132.129 131.773 133.256 131.348 134.359 130.906C135.451 130.457 136.548 129.938 137.533 129.472L137.581 129.448C137.976 129.266 138.141 128.794 137.958 128.398C137.811 128.08 137.474 127.909 137.144 127.95L137.138 127.968Z"
            fill="#7640EB"
          />
        </svg>
        <Collapse in={!isSuccess}>
          <Stack direction="row" gap={1} alignItems="center">
            {isPending ? (
              <Typography variant="h5" textAlign="center">
                <Trans>Uploading your Google Cloud Service Account file...</Trans>
              </Typography>
            ) : data.can_access_sa ? (
              <Typography variant="h5" textAlign="center">
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
              <Typography variant="h5" textAlign="center">
                <Trans>Click or Drop your Google Cloud Service Account file here</Trans>
              </Typography>
            )}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant={progress === 100 ? 'indeterminate' : 'determinate'} value={progress} />
            </Box>
          </Stack>
        </Collapse>
        <Collapse in={!!error}>
          <Alert variant="outlined" severity="error" sx={{ pointerEvents: 'all', cursor: 'initial' }} onClick={(e) => e.stopPropagation()}>
            {errorResponse?.status === 422 && errorMessageDetail ? (
              <>
                <AlertTitle>
                  <Trans>
                    The Google Cloud Service Account key file is valid but did not allow us to list available projects. It is important to
                    ensure that it has the necessary permissions and that the required APIs are enabled to avoid this error. The following
                    message was created by GCP when we tried to list the projects:
                  </Trans>
                  <Divider sx={{ my: 2 }} />
                </AlertTitle>
                <Typography fontWeight={700}>{extractAndSplitUrlFromText(errorMessageDetail)}</Typography>
              </>
            ) : (
              <AlertTitle>
                <Trans>Invalid file, Please follow the step-by-step instructions {isMobile ? t`above` : t`on the right side`}.</Trans>
              </AlertTitle>
            )}
          </Alert>
        </Collapse>
        <Collapse in={!!isSuccess}>
          <Alert variant="outlined" severity="success">
            <AlertTitle>
              <Trans>
                The Google Cloud Service Account has been updated successfully.
                <br />
                We will process the file and add the accounts that we find.
                <br />
                This process may take a <u>few minutes</u>.
                <br />
                We will send you an email once the projects are ready.
              </Trans>
            </AlertTitle>
          </Alert>
        </Collapse>
      </Stack>
    </Dropzone>
  ) : (
    <Skeleton height="100%" width="100%" />
  )
}
