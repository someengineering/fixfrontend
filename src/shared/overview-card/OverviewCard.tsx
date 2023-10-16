import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface OverviewCardProps {
  title?: ReactNode
  value?: ReactNode
  icon?: ReactNode
  iconBackgroundColor?: string
  bottomContent?: ReactNode
}

const isNotReactNode = (node: ReactNode) => {
  switch (typeof node) {
    case 'string':
    case 'number':
      return false
    default:
      return true
  }
}

export const OverviewCard = ({ title, value, icon, iconBackgroundColor, bottomContent }: OverviewCardProps) => {
  return (
    <Card>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            {!title || isNotReactNode(title) ? (
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
            ) : (
              title
            )}
            {!value || !isNotReactNode(value) ? <Typography variant="h4">{value}</Typography> : value}
          </Stack>
          <Avatar
            sx={{
              backgroundColor: iconBackgroundColor,
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>{icon}</SvgIcon>
          </Avatar>
        </Stack>
        {bottomContent && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            {bottomContent}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
