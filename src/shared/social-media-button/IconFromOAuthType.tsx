import { useTheme } from '@mui/material'
import { GithubSEBIcon, GoogleSEBIcon } from 'src/assets/icons'
import { OAuthProviderNames } from 'src/shared/types/server'

export const IconFromOAuthType = ({ name }: { name: OAuthProviderNames }) => {
  const theme = useTheme()
  switch (name) {
    case 'github':
      return <GithubSEBIcon fill={theme.palette.common.black} />
    case 'google':
      return <GoogleSEBIcon />
  }
}
