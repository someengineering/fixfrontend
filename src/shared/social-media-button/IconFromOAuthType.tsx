import { GithubSEBIcon, GoogleSEBIcon } from 'src/assets/icons'
import { OAuthProviderNames } from 'src/shared/types/server'

export const IconFromOAuthType = ({ name }: { name: OAuthProviderNames }) => {
  switch (name) {
    case 'github':
      return <GithubSEBIcon />
    case 'google':
      return <GoogleSEBIcon />
  }
}
