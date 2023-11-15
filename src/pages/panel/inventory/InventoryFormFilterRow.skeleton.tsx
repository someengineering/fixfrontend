import { Skeleton, Stack } from '@mui/material'

export const InventoryFormFilterRowSkeleton = () => {
  return (
    <Stack direction="row" spacing={1}>
      <Skeleton variant="rectangular" width={100} />
      <Skeleton variant="rectangular" width={10} />
      <Skeleton variant="rectangular" width={100} />
    </Stack>
  )
}
