import { Skeleton, Stack } from '@mui/material'

export const InventoryFormFilterRowSkeleton = () => {
  return (
    <Stack direction="row" spacing={1}>
      <Skeleton variant="rounded" width={100} />
      <Skeleton variant="rounded" width={10} />
      <Skeleton variant="rounded" width={100} />
    </Stack>
  )
}
