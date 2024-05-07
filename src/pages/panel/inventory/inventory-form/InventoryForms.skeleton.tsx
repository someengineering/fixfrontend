import { Skeleton, Stack } from '@mui/material'

export const InventoryFormsSkeleton = ({ withChange }: { withChange: boolean }) => {
  return (
    <Stack direction="row" flexWrap="wrap">
      {withChange ? <Skeleton variant="rounded" height={42} width={111} sx={{ mr: 1, mt: 1 }} /> : null}
      <Skeleton variant="rounded" height={42} width={135} sx={{ mr: 1, mt: 1 }} />
      <Skeleton variant="rounded" height={42} width={68} sx={{ mr: 1, mt: 1 }} />
      <Skeleton variant="rounded" height={42} width={70} sx={{ mr: 1, mt: 1 }} />
      <Skeleton variant="rounded" height={42} width={85} sx={{ mr: 1, mt: 1 }} />
      <Skeleton variant="rounded" height={42} width={84} sx={{ mr: 1, mt: 1 }} />
      <Skeleton variant="rounded" height={42} width={85} sx={{ mr: 1, mt: 1 }} />
      <Skeleton variant="rounded" height={42} width={88} sx={{ mr: 1, mt: 1 }} />
    </Stack>
  )
}
