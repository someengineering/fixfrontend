import { Box, CircularProgress, IconButton, Stack } from '@mui/material'
import { CheckIcon, CloseIcon } from 'src/assets/icons'
import { NotificationChannel } from 'src/shared/types/server-shared'

interface WorkspaceAlertingSettingsCheckboxProps {
  benchmark: string
  checked: boolean
  isPending: boolean
  name: NotificationChannel
  onChange: (benchmark: string, name: NotificationChannel, checked: boolean) => void
  hasPermission: boolean
}

export const WorkspaceAlertingSettingsCheckbox = ({
  benchmark,
  checked,
  isPending,
  name,
  onChange,
  hasPermission,
}: WorkspaceAlertingSettingsCheckboxProps) => {
  const checkedIcon = checked ? (
    <CloseIcon height={24} width={24} color="text.secondary" />
  ) : (
    <Box bgcolor="#D8F1B7" borderRadius="50%" height={24} width={24}>
      <CheckIcon height={24} width={24} color="#028235" />
    </Box>
  )
  return (
    <Stack alignItems="center" justifyContent="center" height={42} padding={1}>
      <Box>
        {isPending ? (
          <CircularProgress size={42} />
        ) : hasPermission ? (
          <IconButton onClick={() => onChange(benchmark, name, !checked)}>{checkedIcon}</IconButton>
        ) : (
          checkedIcon
        )}
      </Box>
    </Stack>
  )
}
