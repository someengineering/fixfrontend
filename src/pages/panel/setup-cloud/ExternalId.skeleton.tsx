import { Box, Skeleton } from '@mui/material'

export const ExternalIdSkeleton = () => {
  return (
    <Box ml={2}>
      <Skeleton variant="rounded" width={376} height={52} />
    </Box>
  )
}
