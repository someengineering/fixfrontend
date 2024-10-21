import { Trans } from '@lingui/macro'
import { Box, Button, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { VPNKeyIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { UserSettingsTotpActivationModal } from './UserSettingsTotpActivationModal'
import { UserSettingsTotpDeactivationModal } from './UserSettingsTotpDeactivationModal'
import { getUsersMeQuery } from './getUsersMe.query'

export const UserSettingsTotp = () => {
  const { currentUser } = useUserProfile()
  const activationModalRef = useRef<(show?: boolean | undefined) => void>()
  const deactivationModalRef = useRef<(show?: boolean | undefined) => void>()
  const { data, isLoading } = useQuery({
    queryKey: ['users-me', currentUser?.id],
    queryFn: getUsersMeQuery,
  })
  const isActive = data?.is_mfa_active ?? false
  const buttonName = isActive ? <Trans>Deactivate TOTP setup</Trans> : <Trans>Activate TOTP setup</Trans>
  return (
    <Box width="100%" maxWidth={618}>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%">
          <Button variant="outlined" fullWidth>
            <Trans>Activate</Trans>
          </Button>
        </Skeleton>
      ) : (
        <>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => (isActive ? deactivationModalRef : activationModalRef).current?.(true)}
            startIcon={<VPNKeyIcon />}
          >
            {buttonName}
          </Button>
        </>
      )}
      <UserSettingsTotpActivationModal activationModalRef={activationModalRef} isLoading={isLoading} email={data?.email} />
      <UserSettingsTotpDeactivationModal deactivationModalRef={deactivationModalRef} isLoading={isLoading} />
    </Box>
  )
}
