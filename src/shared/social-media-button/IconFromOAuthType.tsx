import { GithubSEBIcon, GoogleSEBIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { OAuthProviderNames } from 'src/shared/types/server-shared'

interface IconFromOAuthTypeProps {
  name: OAuthProviderNames
}

export const IconFromOAuthType = ({ name }: IconFromOAuthTypeProps) => {
  switch (name) {
    case 'github':
      return <GithubSEBIcon color={panelUI.uiThemePalette.accent.darkGray} width={20} height={20} />
    case 'google':
      return <GoogleSEBIcon width={20} height={20} />
  }
}
