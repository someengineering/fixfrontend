import { Box, Stack, StackProps } from '@mui/material'
import { ReactNode } from 'react'

interface WorkspaceSettingsConnectedServiceItemContainerProps extends StackProps {
  icon: ReactNode
}

export const WorkspaceSettingsConnectedServiceItemContainer = ({
  icon,
  children,
  ...props
}: WorkspaceSettingsConnectedServiceItemContainerProps) => (
  <Stack spacing={1} bgcolor="background.paper" p={5} width={340} {...props}>
    <Box width="100%" pb={2.75}>
      <Stack alignItems="center" justifyContent="center" height={38} width="100%">
        {icon}
      </Stack>
    </Box>
    {children}
  </Stack>
)
