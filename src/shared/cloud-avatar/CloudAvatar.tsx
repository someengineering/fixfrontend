import { Trans } from '@lingui/macro'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Avatar, Box, ButtonBase, Paper, Tooltip, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { AwsLogo, AzureLogo, Crown, FixLogo, GcpLogo } from 'src/assets/icons'
import { useNonce } from 'src/shared/providers'
import { AccountCloud } from 'src/shared/types/server-shared'

export interface CloudAvatarProps {
  cloud: AccountCloud
  withCrown?: boolean
  tooltip?: ReactNode
  error?: ReactNode
  small?: boolean
  onErrorClick?: () => void
}

const CloudIcon = ({ cloud, small, withCrown }: CloudAvatarProps) => {
  const nonce = useNonce()
  const size = small ? 30 : 40
  switch (cloud.toLowerCase()) {
    case 'azure':
      return <AzureLogo nonce={nonce} width={size} height={size} style={withCrown ? { padding: 5 } : undefined} />
    case 'fix':
      return <FixLogo nonce={nonce} width={size} height={size} style={withCrown ? { padding: 5 } : undefined} />
    case 'aws':
      return <AwsLogo nonce={nonce} width={size} height={size} style={withCrown ? { padding: 5 } : undefined} />
    case 'gcp':
      return <GcpLogo nonce={nonce} width={size} height={size} style={withCrown ? { padding: 5 } : undefined} />
    default:
      return (
        <Avatar sx={{ bgcolor: 'primary.main', width: size, height: size, fontSize: size / 2 }}>
          {cloud.substring(0, 2).toUpperCase()}
        </Avatar>
      )
  }
}

const cloudDefaultTooltip = (cloud: AccountCloud) => {
  switch (cloud) {
    case 'aws':
      return 'AWS'
    case 'azure':
      return 'Azure'
    case 'fix':
      return 'FIX'
    case 'gcp':
      return 'GCP'
    default:
      return cloud
  }
}

export const CloudAvatar = ({ cloud, small, withCrown, tooltip, error, onErrorClick }: CloudAvatarProps) => (
  <Tooltip title={tooltip === true ? cloudDefaultTooltip(cloud) : tooltip} arrow>
    <Box position="relative">
      <Box margin="0 auto">
        <CloudIcon cloud={cloud} small={small} withCrown={withCrown} />
      </Box>
      {withCrown ? (
        <>
          <Box position="absolute" width={50} left={-5} top={-15} display="flex" alignItems="center" justifyContent="center">
            <Typography fontSize={8} variant="overline" color="#ffc156">
              <Trans>Privileged</Trans>
            </Typography>
          </Box>
          <Box position="absolute" left={-5} top={-1}>
            <Crown width={50} height={50} />
          </Box>
        </>
      ) : null}
      {error ? (
        <Tooltip title={error} arrow>
          <Box
            onClick={onErrorClick}
            component={Paper}
            position="absolute"
            height={24}
            width={24}
            top={-10}
            left={30}
            elevation={24}
            sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
          >
            <ButtonBase onClick={onErrorClick}>
              <WarningAmberIcon width={24} height={24} color="warning" />
            </ButtonBase>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  </Tooltip>
)
