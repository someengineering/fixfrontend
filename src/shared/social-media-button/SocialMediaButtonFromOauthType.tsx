import { LoadingButtonProps } from '@mui/lab'
import { OAuthProviderNames } from 'src/shared/types/server-shared'
import { IconFromOAuthType } from './IconFromOAuthType'
import { SocialMediaButton } from './SocialMediaButton'
import { getColorFromOAuthType } from './getColorFromOAuthType'
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
      startIcon={<IconFromOAuthType name={name} />}
      loadingPosition="start"
      variant="contained"
      {...getColorFromOAuthType(name)}
      {...props}
    >
      {getNameFromOAuthType(name, isSignup)}
    </SocialMediaButton>
  )
}
