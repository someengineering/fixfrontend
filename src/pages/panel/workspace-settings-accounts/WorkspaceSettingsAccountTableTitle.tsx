import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'
import { AddAccountButton, AddAccountButtonDisabled } from 'src/shared/add-account-button'

interface WorkspaceSettingsAccountTableTitleProps extends PropsWithChildren {
  isTop: boolean
  withAddButton?: boolean
  errorModalContent?: ReactNode
}

export const WorkspaceSettingsAccountTableTitle = ({
  isTop,
  withAddButton,
  children,
  errorModalContent,
}: WorkspaceSettingsAccountTableTitleProps) =>
  isTop ? (
    <Stack
      mb={{ xs: 0, sm: 1 }}
      direction={isTop ? { xs: 'column-reverse', sm: 'row' } : undefined}
      spacing={isTop ? 2 : undefined}
      width={isTop ? '100%' : undefined}
      justifyContent={isTop ? 'space-between' : undefined}
    >
      <Typography variant="h4">{children}</Typography>
      {withAddButton ? (
        <AddAccountButton />
      ) : (
        <Tooltip title={errorModalContent} slotProps={{ tooltip: { sx: { p: 0 } } }} arrow>
          <Box>
            <AddAccountButtonDisabled />
          </Box>
        </Tooltip>
      )}
    </Stack>
  ) : (
    <Box mb={{ xs: 0, sm: 1 }}>
      <Typography variant="h4">{children}</Typography>
    </Box>
  )
