import { Trans } from '@lingui/macro'
import { Button } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCfUrlQuery } from 'src/pages/panel/shared/queries'

export const SetupCloudButton = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data: cloudSetupUrlData } = useSuspenseQuery({
    queryKey: ['workspace-cf-url', selectedWorkspace?.id],
    queryFn: getWorkspaceCfUrlQuery,
  })
  return (
    <Button component="a" variant="contained" href={cloudSetupUrlData} target="_blank" size="large">
      <Trans>Deploy Stack</Trans>
    </Button>
  )
}
