import { Button, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export default function HomePage() {
  const { data } = useQuery(['organization'], () => axiosWithAuth.get<Object>(endPoints.organizations.get).then((res) => res.data))
  const { logout } = useUserProfile()
  return (
    <>
      <Typography variant="h1" color="secondary" mb={2}>
        Setup cloud
      </Typography>
      <Button onClick={logout} size="large" variant="contained">
        Logout
      </Button>
      <Stack component={'pre'}>{JSON.stringify(data, null, '  ')}</Stack>
    </>
  )
}
