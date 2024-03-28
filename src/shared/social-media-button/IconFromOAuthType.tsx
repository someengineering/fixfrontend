import { GithubSEBIcon, GoogleSEBIcon } from 'src/assets/icons'
import { OAuthProviderNames } from 'src/shared/types/server'

interface IconFromOAuthTypeProps {
  name: OAuthProviderNames
}

export const IconFromOAuthType = ({ name }: IconFromOAuthTypeProps) => {
  switch (name) {
    case 'github':
      return <GithubSEBIcon />
    case 'google':
      return <GoogleSEBIcon />
  }
}
