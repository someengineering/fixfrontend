import { ButtonProps } from '@mui/material'
import { OAuthProviderNames } from 'src/shared/types/server'
import { getColorFromOAuthType } from './getColorFromOAuthType'
import { getIconFromOAuthType } from './getIconFromOAuthType'
import { getNameFromOAuthType } from './getNameFromOAuthType'
import { SocialMediaButton } from './SocialMediaButton'

interface SocialMediaButtonFromOauthTypeProps extends ButtonProps {
  name: OAuthProviderNames
  authUrl: string
}

export const SocialMediaButtonFromOauthType = ({ name, authUrl, ...props }: SocialMediaButtonFromOauthTypeProps) => {
  return (
    <SocialMediaButton
      href={authUrl}
      startIcon={getIconFromOAuthType(name)}
      variant="contained"
      {...getColorFromOAuthType(name)}
      {...props}
    >
      {getNameFromOAuthType(name)}
    </SocialMediaButton>
  )
}
