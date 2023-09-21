import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { SocialMediaButtonFromOauthType } from 'src/shared/social-media-button'
import { oauthProvidersQuery } from './oauthProviders.query'

export const LoginSocialMedia = () => {
  const { data } = useQuery([], oauthProvidersQuery)

  return (
    <>
      {data?.map((item, i) => (
        <Grid item key={i}>
          <SocialMediaButtonFromOauthType authUrl={item.authUrl} name={item.name} fullWidth />
        </Grid>
      ))}
    </>
  )
}
