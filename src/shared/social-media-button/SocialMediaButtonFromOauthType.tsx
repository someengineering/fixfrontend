import { LoadingButtonProps } from '@mui/lab'
import { OAuthProviderNames } from 'src/shared/types/server'
import { SocialMediaButton } from './SocialMediaButton'
import { getColorFromOAuthType } from './getColorFromOAuthType'
import { getIconFromOAuthType } from './getIconFromOAuthType'
import { getNameFromOAuthType } from './getNameFromOAuthType'

interface SocialMediaButtonFromOauthTypeProps extends LoadingButtonProps {
  name: OAuthProviderNames
  authUrl: string
  isSignup?: boolean
}

export const SocialMediaButtonFromOauthType = ({ name, authUrl, isSignup, ...props }: SocialMediaButtonFromOauthTypeProps) => {
  return (
    <SocialMediaButton
      href={authUrl}
      startIcon={getIconFromOAuthType(name)}
      loadingPosition="start"
      variant="contained"
      {...getColorFromOAuthType(name)}
      {...props}
    >
      {getNameFromOAuthType(name, isSignup)}
    </SocialMediaButton>
  )
}
