import { Trans } from '@lingui/macro'
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
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
  const buttonName = isActive ? <Trans>Deactivate</Trans> : <Trans>Activate</Trans>
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
      <Box width={150}>
        <Typography>
          <Trans>TOTP</Trans>:
        </Typography>
      </Box>
      <Box width={{ xs: '100%', lg: 400 }}>
        {isLoading ? (
          <Skeleton variant="rounded" width="100%">
            <Button variant="contained">
              <Trans>Activate</Trans>
            </Button>
          </Skeleton>
        ) : (
          <>
            <Button variant="contained" onClick={() => (isActive ? deactivationModalRef : activationModalRef).current?.(true)}>
              {buttonName}
            </Button>
          </>
        )}
        <UserSettingsTotpActivationModal activationModalRef={activationModalRef} isLoading={isLoading} email={data?.email} />
        <UserSettingsTotpDeactivationModal deactivationModalRef={deactivationModalRef} isLoading={isLoading} />
      </Box>
    </Stack>
  )
}
