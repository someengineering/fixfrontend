import { Trans } from '@lingui/macro'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { IconFromOAuthType } from 'src/shared/social-media-button'
import { OAuthAssociateResponse } from 'src/shared/types/server'
import { UserSettingsSocialNetworkDeleteButton } from './UserSettingsSocialNetworkDeleteButton'

export const UserSettingsSocialNetwork = ({ account_id, associated, authUrl, account_email, name }: OAuthAssociateResponse) => {
  const connected = associated && account_id
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
      <IconFromOAuthType name={name} />
      <Box minWidth={{ md: 400 }}>
        <Typography>{account_email ?? 'N/A'}</Typography>
      </Box>
      {connected ? <UserSettingsSocialNetworkDeleteButton name={name} providerId={account_id} email={account_email} /> : null}
      <Button href={authUrl} variant="contained">
        {associated ? <Trans>Re-Authenticate</Trans> : <Trans>Connect</Trans>}
      </Button>
      <Box display={{ xs: undefined, md: 'none' }} width={{ xs: '100%', md: undefined }}>
        <Divider />
      </Box>
    </Stack>
  )
}
