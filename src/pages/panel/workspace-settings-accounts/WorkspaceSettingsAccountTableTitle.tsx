import { Box, Stack, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'
import { AddAccountButton } from 'src/shared/add-account-button'

interface WorkspaceSettingsAccountTableTitleProps extends PropsWithChildren {
  isTop: boolean
}

export const WorkspaceSettingsAccountTableTitle = ({ isTop, children }: WorkspaceSettingsAccountTableTitleProps) =>
  isTop ? (
    <Stack
      mb={{ xs: 0, sm: 1 }}
      direction={isTop ? { xs: 'column-reverse', sm: 'row' } : undefined}
      spacing={isTop ? 2 : undefined}
      width={isTop ? '100%' : undefined}
      justifyContent={isTop ? 'space-between' : undefined}
    >
      <Typography variant="h4">{children}</Typography>
      <AddAccountButton />
    </Stack>
  ) : (
    <Box mb={{ xs: 0, sm: 1 }}>
      <Typography variant="h4">{children}</Typography>
    </Box>
  )
