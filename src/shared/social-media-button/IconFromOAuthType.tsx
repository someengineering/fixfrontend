import { GithubSEBIcon, GoogleSEBIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { OAuthProviderNames } from 'src/shared/types/server-shared'

interface IconFromOAuthTypeProps {
  name: OAuthProviderNames
  width?: number
}

export const IconFromOAuthType = ({ name, width = 20 }: IconFromOAuthTypeProps) => {
  switch (name) {
    case 'github':
      return <GithubSEBIcon color={panelUI.uiThemePalette.accent.darkGray} width={width} height={width} />
    case 'google':
      return <GoogleSEBIcon width={width} height={width} />
  }
}
