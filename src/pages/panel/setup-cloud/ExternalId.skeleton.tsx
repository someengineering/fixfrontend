import { Box, Skeleton } from '@mui/material'

export const ExternalIdSkeleton = () => {
  return (
    <Box ml={2}>
      <Skeleton variant="rectangular" width={376} height={52} />
    </Box>
  )
}
