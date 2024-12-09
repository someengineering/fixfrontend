import { Box, LinearProgress, LinearProgressProps, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface ComplianceCardProps {
  avatar: ReactNode
  title: ReactNode
  description: ReactNode
  percentage: number
  color: LinearProgressProps['color']
}

export const ComplianceCard = ({ avatar, color, description, percentage, title }: ComplianceCardProps) => {
  return (
    <Stack
      p={3}
      spacing={3}
      direction="row"
      borderRadius="12px"
      border={({ palette }) => `1px solid ${palette.divider}`}
      alignItems="center"
      width="100%"
    >
      <Box>{avatar}</Box>
      <Stack spacing={1.5} width="100%">
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight={700}>
            {title}
          </Typography>
          <Typography color="textSecondary">{description}</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={percentage} sx={{ height: 6, borderRadius: 3 }} color={color} />
      </Stack>
    </Stack>
  )
}
