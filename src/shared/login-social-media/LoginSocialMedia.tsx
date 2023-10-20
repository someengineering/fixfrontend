import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { SocialMediaButtonFromOauthType } from 'src/shared/social-media-button'
import { oauthProvidersQuery } from './oauthProviders.query'

interface LoginSocialMediaProps {
  isSignup?: boolean
  isLoading: boolean
  onClick?: () => void
}

export const LoginSocialMedia = ({ isSignup, isLoading, onClick }: LoginSocialMediaProps) => {
  const [search] = useSearchParams()
  const { data } = useQuery({ queryKey: ['LoginSocialMedia', search.get('returnUrl') ?? '/'], queryFn: oauthProvidersQuery })

  return (
    <>
      {data?.map((item, i) => (
        <Grid item key={i}>
          <SocialMediaButtonFromOauthType
            authUrl={item.authUrl}
            name={item.name}
            fullWidth
            isSignup={isSignup}
            loading={isLoading}
            onClick={onClick}
          />
        </Grid>
      ))}
    </>
  )
}
