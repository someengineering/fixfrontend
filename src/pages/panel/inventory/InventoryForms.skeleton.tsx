import { Grid, Skeleton } from '@mui/material'

export const InventoryFormsSkeleton = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
    </Grid>
  )
}
