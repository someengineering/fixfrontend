import { Trans } from '@lingui/macro'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getOrganizationCfUrlQuery } from 'src/pages/panel/shared-queries'

export const SetupCloudButton = () => {
  const { selectedOrganization } = useUserProfile()
  const { data: cloudSetupUrlData } = useQuery(['organization-cf-url', selectedOrganization?.id], getOrganizationCfUrlQuery, {
    enabled: !!selectedOrganization?.id,
  })
  return (
    <Button component="a" variant="contained" href={cloudSetupUrlData} target="_blank">
      <Trans>Go To Setup</Trans>
    </Button>
  )
}
