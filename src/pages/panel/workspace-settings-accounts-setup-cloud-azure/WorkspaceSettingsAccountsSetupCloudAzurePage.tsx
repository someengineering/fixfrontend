import { Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Theme, useMediaQuery } from '@mui/material'
import { Suspense, useState } from 'react'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceSettingsAccountsSetupCloudAzureForm } from './WorkspaceSettingsAccountsSetupCloudAzureForm'
import { WorkspaceSettingsAccountsSetupCloudAzureInstructions } from './WorkspaceSettingsAccountsSetupCloudAzureInstructions'

export default function WorkspaceSettingsAccountsSetupCloudAzurePage() {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('lg'))
  const [hasError, setHasError] = useState(true)
  const [isPending, setIsPending] = useState(true)

  const submitButton = (
    <LoadingButton type="submit" variant="contained" loading={isPending} loadingPosition="end" endIcon={<SendIcon />} disabled={hasError}>
      <Trans>Submit</Trans>
    </LoadingButton>
  )

  return (
    <Suspense fallback={<FullPageLoadingSuspenseFallback />}>
      <WorkspaceSettingsAccountsSetupCloudAzureForm
        isMobile={isMobile}
        hasError={hasError}
        setIsPending={setIsPending}
        setHasError={setHasError}
        submitButton={submitButton}
      >
        <WorkspaceSettingsAccountsSetupCloudAzureInstructions isMobile={isMobile}>
          {submitButton}
        </WorkspaceSettingsAccountsSetupCloudAzureInstructions>
      </WorkspaceSettingsAccountsSetupCloudAzureForm>
    </Suspense>
  )
}
