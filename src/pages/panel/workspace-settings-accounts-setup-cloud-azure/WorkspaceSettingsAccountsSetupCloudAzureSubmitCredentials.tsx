import { Trans, t } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Skeleton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { PutWorkspaceCloudAccountAzureCredentialsErrorResponse } from 'src/shared/types/server'
import { WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput } from './WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput'
import { getWorkspaceCloudAccountAzureCredentialsQuery } from './getWorkspaceCloudAccountAzureCredentials.query'
import { putWorkspaceCloudAccountAzureKeyMutation } from './putWorkspaceCloudAccountAzureCredentials.mutation'

interface WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsProps {
  isMobile?: boolean
}

type AzureFormNames = 'azure_tenant_id' | 'client_id' | 'client_secret'

export const WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentials = ({
  isMobile,
}: WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsProps) => {
  const [hasError, setHasError] = useState(true)
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-cloud-account-azure-credentials', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountAzureCredentialsQuery,
  })
  const formData = useRef<Record<AzureFormNames, { hasError: boolean; value: string }>>({
    azure_tenant_id: { hasError: true, value: '' },
    client_id: { hasError: true, value: '' },
    client_secret: { hasError: true, value: '' },
  })
  const { mutate, isPending, error } = useMutation({
    mutationFn: putWorkspaceCloudAccountAzureKeyMutation,
    onError: () => {
      setHasError(true)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-cloud-account-azure-credentials',
      })
    },
  })
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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

  const errorResponse = (error as AxiosError<PutWorkspaceCloudAccountAzureCredentialsErrorResponse>)?.response
  const errorMessageDetail = errorResponse?.data?.detail

  const handleChange = (name: AzureFormNames, value: string) => {
    formData.current[name].value = value
  }

  const handleError = (name: AzureFormNames, error?: string) => {
    formData.current[name].hasError = !!error
    setHasError(!!Object.values(formData.current).find((i) => i.hasError))
  }

  return selectedWorkspace?.id && data ? (
    <Stack
      width={isMobile ? '100%' : '50%'}
      spacing={1}
      component="form"
      onSubmit={handleSubmit}
      justifyContent="center"
      alignItems="center"
      noValidate
      autoComplete="off"
    >
      <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput
        name="client_id"
        label={t`Application (client) ID`}
        onChange={handleChange}
        onError={handleError}
        uuidRegex
      />
      <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput
        name="azure_tenant_id"
        label={t`Directory (tenant) ID`}
        onChange={handleChange}
        onError={handleError}
        uuidRegex
      />
      <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentialsInput
        name="client_secret"
        label={t`Secret Value`}
        onChange={handleChange}
        onError={handleError}
      />
      {errorMessageDetail ? (
        <Typography color="error.main" variant="h6">
          {errorMessageDetail}
        </Typography>
      ) : null}
      <LoadingButton type="submit" variant="contained" loading={isPending} loadingPosition="end" endIcon={<SendIcon />} disabled={hasError}>
        <Trans>Submit</Trans>
      </LoadingButton>
    </Stack>
  ) : (
    <Skeleton height="100%" width="100%" />
  )
}
