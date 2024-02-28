import { Box, Divider, Skeleton, Stack } from '@mui/material'

export const UserSettingsSocialNetworkSkeleton = () => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
      <Skeleton variant="rounded" height={26} width={26} />
      <Skeleton variant="text" height={19} width={400} />
      <Skeleton variant="rounded" height={37} width={99} />
      <Box display={{ xs: undefined, md: 'none' }} width={{ xs: '100%', md: undefined }}>
        <Divider />
      </Box>
    </Stack>
  )
}
