import { useSuspenseQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { panelUI } from 'src/shared/constants'
import { SocialMediaButtonFromOauthType } from 'src/shared/social-media-button'
import { getOAuthProvidersQuery } from './getOAuthProviders.query'

interface LoginSocialMediaProps {
  isSignup?: boolean
  isLoading: boolean
  onClick?: () => void
}

export const LoginSocialMedia = ({ isSignup, isLoading, onClick }: LoginSocialMediaProps) => {
  const [search] = useSearchParams()
  const { data } = useSuspenseQuery({
    queryKey: ['LoginSocialMedia', search.get('returnUrl') ?? panelUI.homePage],
    queryFn: getOAuthProvidersQuery,
  })

  return (
    <>
      {data.map((item, i) => (
        <SocialMediaButtonFromOauthType
          key={i}
          authUrl={item.authUrl}
          name={item.name}
          fullWidth
          isSignup={isSignup}
          loading={isLoading}
          onClick={onClick}
        />
      ))}
    </>
  )
}
