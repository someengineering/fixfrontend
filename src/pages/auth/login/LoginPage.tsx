import { t } from '@lingui/macro'
import { Button, Card, CardContent, CardHeader, Container, Grid, styled, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { FormEvent } from 'react'
import { SocialMediaButtonFromOauthType } from 'src/shared/social-media-button'
import { oauthProvidersQuery } from './oauthProviders.query'

const LoginCardStyle = styled(Card<'form'>)(({ theme }) => ({
  textAlign: 'center',
}))

export default function LoginPage() {
  const { data } = useQuery([], oauthProvidersQuery)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const username: string | undefined = e.currentTarget.username
    const password: string | undefined = e.currentTarget.password
    console.log({ username, password })
  }
  return (
    <Container maxWidth="sm">
      <LoginCardStyle component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <CardHeader title={t`Login`} />
        <CardContent component={Grid} container spacing={3} alignItems="center" direction="column">
          <Grid item>
            <TextField required id="username" label={t`Username`} sx={{ background: 'white' }} variant="outlined" />
          </Grid>
          <Grid item>
            <TextField required id="password" label={t`Password`} sx={{ background: 'white' }} variant="outlined" />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Grid>
          {data?.map((item) => (
            <Grid item>
              <SocialMediaButtonFromOauthType authUrl={item.authUrl} name={item.name} fullWidth />
            </Grid>
          ))}
        </CardContent>
      </LoginCardStyle>
    </Container>
  )
}
