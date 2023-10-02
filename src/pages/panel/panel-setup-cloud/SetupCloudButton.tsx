import { Trans } from '@lingui/macro'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getOrganizationCfUrlQuery, getOrganizationQuery } from 'src/pages/panel/shared-queries'

export const SetupCloudButton = () => {
  const { data: organizationData } = useQuery(['organization'], getOrganizationQuery)
  const { data: cloudSetupUrlData } = useQuery(['organization-cf-url', organizationData?.[0].id], getOrganizationCfUrlQuery, {
    enabled: !!organizationData?.[0].id,
  })
  return (
    <Button variant="contained" href={cloudSetupUrlData}>
      <Trans>Go To Setup</Trans>
    </Button>
  )
}
