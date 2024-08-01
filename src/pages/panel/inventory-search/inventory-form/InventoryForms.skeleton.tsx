import { Skeleton, Stack } from '@mui/material'

interface InventoryFormsSkeletonProps {
  withChanges: boolean
}

export const InventoryFormsSkeleton = ({ withChanges }: InventoryFormsSkeletonProps) => {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {withChanges ? <Skeleton variant="rounded" height={42} width={111} /> : null}
      <Skeleton variant="rounded" height={42} width={135} />
      <Skeleton variant="rounded" height={42} width={68} />
      <Skeleton variant="rounded" height={42} width={70} />
      <Skeleton variant="rounded" height={42} width={85} />
      <Skeleton variant="rounded" height={42} width={84} />
      <Skeleton variant="rounded" height={42} width={85} />
      <Skeleton variant="rounded" height={42} width={88} />
    </Stack>
  )
}
