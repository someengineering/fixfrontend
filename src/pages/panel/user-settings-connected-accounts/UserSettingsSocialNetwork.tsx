import { Trans } from '@lingui/macro'
import { Box, Button, Stack, Typography } from '@mui/material'
import { PowerIcon, RefreshIcon } from 'src/assets/icons'
import { IconFromOAuthType } from 'src/shared/social-media-button'
import { OAuthAssociateResponse } from 'src/shared/types/server'
import { UserSettingsSocialNetworkDisconnectButton } from './UserSettingsSocialNetworkDisconnectButton'

type UserSettingsSocialNetworkProps = OAuthAssociateResponse

export const UserSettingsSocialNetwork = ({ account_id, associated, authUrl, account_email, name }: UserSettingsSocialNetworkProps) => {
  const connected = associated && account_id
  return (
    <Stack direction="row" spacing={2} alignItems="center" py={2}>
      <IconFromOAuthType name={name} width={30} />
      <Box flex={1}>
        <Typography variant="body2">{account_email ?? <Trans>Not added</Trans>}</Typography>
      </Box>
      {connected ? <UserSettingsSocialNetworkDisconnectButton name={name} providerId={account_id} email={account_email} /> : null}
      <Button
        href={authUrl}
        color={associated ? 'primary' : 'success'}
        variant="contained"
        startIcon={associated ? <RefreshIcon /> : <PowerIcon />}
      >
        {associated ? <Trans>Re-Authenticate</Trans> : <Trans>Connect</Trans>}
      </Button>
    </Stack>
  )
}
