import { Box, Skeleton, Stack, StackProps } from '@mui/material'

export const UserSettingsSocialNetworkSkeleton = (stackProps: StackProps) => (
  <Stack direction="row" spacing={2} alignItems="center" py={2} {...stackProps}>
    <Skeleton variant="rounded" height={30} width={30} />
    <Box flex={1}>
      <Skeleton variant="text" height={22} width={83} />
    </Box>
    <Skeleton variant="rounded" height={40} width={112} />
  </Stack>
)
