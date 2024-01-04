import { Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

export const SubscriptionHeader = ({ children }: PropsWithChildren) => (
  <Stack sx={{ width: '100%', px: { xs: 1, sm: 2, md: 4, lg: 8, xl: 16 } }}>{children}</Stack>
)
