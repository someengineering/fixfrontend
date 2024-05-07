import { Trans } from '@lingui/macro'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Avatar, Box, ButtonBase, Paper, Tooltip, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { AwsLogo, Crown, FixLogo, GcpLogo } from 'src/assets/icons'

interface CloudAvatar {
  cloud: string
  withCrown?: boolean
  tooltip?: ReactNode
  error?: ReactNode
  small?: boolean
  onErrorClick?: () => void
}

const CloudIcon = ({ cloud, small }: CloudAvatar) => {
  const size = small ? 30 : 40
  switch (cloud.toLowerCase()) {
    case 'fix':
      return <FixLogo width={size} height={size} />
    case 'aws':
      return <AwsLogo width={size} height={size} />
    case 'gcp':
      return <GcpLogo width={size} height={size} />
    default:
      return (
        <Avatar sx={{ bgcolor: 'primary.main', width: size, height: size, fontSize: size / 2 }}>
          {cloud.substring(0, 2).toUpperCase()}
        </Avatar>
      )
  }
}

export const CloudAvatar = ({ cloud, small, withCrown, tooltip, error, onErrorClick }: CloudAvatar) => (
  <Tooltip title={tooltip}>
    <Box position="relative">
      <Box margin="0 auto">
        <CloudIcon cloud={cloud} small={small} />
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
        <Tooltip title={error}>
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
