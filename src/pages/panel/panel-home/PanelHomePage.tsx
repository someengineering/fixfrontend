import { Button, Stack } from '@mui/material'
import { useUserProfile } from 'src/core/auth'

export default function HomePage() {
  const { organizations } = useUserProfile()
  const { logout } = useUserProfile()
  return (
    <>
      <Button onClick={logout} size="large" variant="contained">
        Logout
      </Button>
      <Stack component="pre">{JSON.stringify(organizations, null, '  ')}</Stack>
    </>
  )
}
