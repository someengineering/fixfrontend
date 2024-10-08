import { Trans, t } from '@lingui/macro'
import { Alert, AlertTitle, Skeleton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Dispatch, FormEvent, PropsWithChildren, ReactNode, SetStateAction, useEffect, useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { panelUI } from 'src/shared/constants'
import { PutWorkspaceCloudAccountAzureCredentialsErrorResponse } from 'src/shared/types/server'
import { WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput } from './WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput'
import { getWorkspaceCloudAccountAzureCredentialsQuery } from './getWorkspaceCloudAccountAzureCredentials.query'
import { putWorkspaceCloudAccountAzureKeyMutation } from './putWorkspaceCloudAccountAzureCredentials.mutation'

interface WorkspaceSettingsAccountsSetupCloudAzureFormProps extends PropsWithChildren {
  isMobile?: boolean
  submitButton: ReactNode
  hasError: boolean
  setHasError: Dispatch<SetStateAction<boolean>>
  setIsPending: Dispatch<SetStateAction<boolean>>
}

type AzureFormNames = 'azure_tenant_id' | 'client_id' | 'client_secret'

const errorResponseToMessage = (error?: AxiosError<PutWorkspaceCloudAccountAzureCredentialsErrorResponse>) => {
  const detail = error?.response?.data?.detail
  switch (detail) {
    case 'invalid_credentials':
      return t`Incorrect credentials. Please carefully review and re-enter your Application ID, Directory ID, and Secret Value correctly, then submit again.`
  }
  return detail
}

export const WorkspaceSettingsAccountsSetupCloudAzureForm = ({
  isMobile,
  hasError,
  children,
  submitButton,
  setHasError,
  setIsPending,
}: WorkspaceSettingsAccountsSetupCloudAzureFormProps) => {
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-cloud-account-azure-credentials', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountAzureCredentialsQuery,
  })
  const formData = useRef<Record<AzureFormNames, { hasError: boolean; value: string }>>({
    azure_tenant_id: { hasError: true, value: '' },
    client_id: { hasError: true, value: '' },
    client_secret: { hasError: true, value: '' },
  })
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: putWorkspaceCloudAccountAzureKeyMutation,
    onError: () => {
      setHasError(true)
    },
    onSuccess: () => {
      showSnackbar(t`Done! We will now import your Azure accounts, this usually takes a couple of minutes.`, { alertColor: 'success' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-cloud-account-azure-credentials',
      })
    },
  })
  useEffect(() => {
    setIsPending(isPending)
  }, [isPending, setIsPending])

  useEffect(() => {
    if ((data.client_id, data.azure_tenant_id)) {
      formData.current.azure_tenant_id = { value: data.azure_tenant_id, hasError: false }
      formData.current.client_id = { value: data.client_id, hasError: false }
    }
  }, [data.client_id, data.azure_tenant_id])

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!hasError) {
      const workspaceId = selectedWorkspace?.id
      const azure_tenant_id = formData.current.azure_tenant_id.value
      const client_id = formData.current.client_id.value
      const client_secret = formData.current.client_secret.value

      if (workspaceId && azure_tenant_id && client_id && client_secret) {
        mutate({
          azure_tenant_id,
          client_id,
          client_secret,
          workspaceId,
        })
      }
    }
  }

  const errorMessageDetail = errorResponseToMessage(error as AxiosError<PutWorkspaceCloudAccountAzureCredentialsErrorResponse>)

  const handleChange = (name: AzureFormNames, value: string) => {
    formData.current[name].value = value
  }

  const handleError = (name: AzureFormNames, error?: string) => {
    formData.current[name].hasError = !!error
    setHasError(!!Object.values(formData.current).find((i) => i.hasError))
  }

  return (
    <Stack
      direction={isMobile ? 'column-reverse' : 'row'}
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      flex={0.5}
      height={{ xs: undefined, lg: '100%' }}
      width="100%"
      gap={{ xs: 2.5, lg: 3.75 }}
    >
      {selectedWorkspace?.id && data ? (
        isSuccess ? (
          <Stack
            width={isMobile ? '100%' : '50%'}
            justifyContent="center"
            alignItems="center"
            border={`1px dashed ${panelUI.uiThemePalette.primary.divider}`}
            borderRadius="12px"
          >
            <Typography maxWidth={400}>
              <Trans>Done! We will now import your Azure accounts, this usually takes a couple of minutes.</Trans>
            </Typography>
          </Stack>
        ) : (
          <Stack
            width={isMobile ? '100%' : '50%'}
            spacing={1}
            justifyContent="center"
            alignItems="center"
            paddingBottom={3}
            border={`2px dashed ${panelUI.uiThemePalette.primary.divider}`}
            borderRadius="12px"
          >
            <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput
              name="client_id"
              label={t`Application (client) ID`}
              defaultValue={data.client_id}
              onChange={handleChange}
              onError={handleError}
              disabled={isPending}
              uuidRegex
            />
            <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput
              name="azure_tenant_id"
              label={t`Directory (tenant) ID`}
              defaultValue={data.azure_tenant_id}
              onChange={handleChange}
              onError={handleError}
              disabled={isPending}
              uuidRegex
            />
            <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput
              name="client_secret"
              label={t`Secret Value`}
              onChange={handleChange}
              onError={handleError}
              disabled={isPending}
            />
            {errorMessageDetail ? (
              <Alert severity="error" sx={{ width: 500, maxWidth: '100%' }}>
                <AlertTitle>
                  <Trans>Submission Error</Trans>:
                </AlertTitle>
                {errorMessageDetail}
              </Alert>
            ) : null}
            {submitButton}
          </Stack>
        )
      ) : (
        <Skeleton height="100%" width="100%" />
      )}
      {children}
    </Stack>
  )
}
