import { Trans } from '@lingui/macro'
import { Button, ButtonProps, Skeleton } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ElementType, Suspense } from 'react'
import { OpenInNewIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCfUrlQuery } from 'src/pages/panel/shared/queries'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'

const SetupCloudButtonComponentSkeleton = (props: SetupCloudButtonProps<'button'>) => (
  <Skeleton variant="rounded">
    <Button {...props}>
      <Trans>Deploy Stack</Trans>
    </Button>
  </Skeleton>
)

export type SetupCloudButtonProps<ButtonType extends ElementType = 'a'> = Omit<ButtonProps<ButtonType>, 'component' | 'href' | 'target'>

const SetupCloudButtonComponent = (props: SetupCloudButtonProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data: cloudSetupUrlData } = useSuspenseQuery({
    queryKey: ['workspace-cf-url', selectedWorkspace?.id],
    queryFn: getWorkspaceCfUrlQuery,
  })
  return (
    <Button
      endIcon={<OpenInNewIcon />}
      children={<Trans>Deploy Stack</Trans>}
      {...props}
      component="a"
      href={cloudSetupUrlData}
      target="_blank"
      rel="noopener noreferrer"
    />
  )
}

export const SetupCloudButton = (props: SetupCloudButtonProps) => (
  <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <Suspense fallback={<SetupCloudButtonComponentSkeleton />}>
      <SetupCloudButtonComponent {...props} />
    </Suspense>
  </NetworkErrorBoundary>
)
