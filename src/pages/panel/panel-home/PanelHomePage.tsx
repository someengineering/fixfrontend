import { Button, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getOrganizationQuery } from '../shared-queries'

export default function HomePage() {
  const { data } = useQuery(['organization'], getOrganizationQuery)
  const { logout } = useUserProfile()
  return (
    <>
      <Button onClick={logout} size="large" variant="contained">
        Logout
      </Button>
      <Stack component="pre">{JSON.stringify(data, null, '  ')}</Stack>
    </>
  )
}
