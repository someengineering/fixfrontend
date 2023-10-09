import { Button, Stack } from '@mui/material'
import { useUserProfile } from 'src/core/auth'

export default function HomePage() {
  const { workspaces } = useUserProfile()
  const { logout } = useUserProfile()
  return (
    <>
      <Button onClick={logout} size="large" variant="contained">
        Logout
      </Button>
      <Stack component="pre" overflow="auto">
        {JSON.stringify(workspaces, null, '  ')}
      </Stack>
    </>
  )
}
