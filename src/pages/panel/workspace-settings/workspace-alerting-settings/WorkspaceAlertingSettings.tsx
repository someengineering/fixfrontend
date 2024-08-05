import { Trans, t } from '@lingui/macro'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  ListItemButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { HTMLAttributes, useEffect, useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceNotificationsQuery } from 'src/pages/panel/shared/queries'
import { getColorBySeverity, useGetBenchmarks } from 'src/pages/panel/shared/utils'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { NotificationChannel, SeverityType } from 'src/shared/types/server-shared'
import { getWorkspaceAlertingSettingsQuery } from './getWorkspaceAlertingSettings.query'
import { putWorkspaceAlertingSettingsQuery } from './putWorkspaceAlertingSettings.query'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as const

interface WorkspaceAlertingSettingsCheckboxProps {
  benchmark: string
  checked: boolean
  isPending: boolean
  name: NotificationChannel
  onChange: (benchmark: string, name: NotificationChannel, checked: boolean) => void
  hasPermission: boolean
}

const WorkspaceAlertingSettingsCheckbox = ({
  benchmark,
  checked,
  isPending,
  name,
  onChange,
  hasPermission,
}: WorkspaceAlertingSettingsCheckboxProps) => {
  return isPending ? (
    <Stack justifyContent="center" direction="column" padding={1} margin="1px">
      <CircularProgress size={20} />
    </Stack>
  ) : hasPermission ? (
    <Checkbox checked={checked} onChange={(e) => onChange(benchmark, name, e.target.checked)} />
  ) : checked ? (
    <CheckIcon color="success" />
  ) : (
    <CloseIcon color="disabled" />
  )
}

export const WorkspaceAlertingSettings = () => {
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')
  const { data: benchmarks, isLoading: isBenchmarksLoading } = useGetBenchmarks(true, undefined, true)
  const [{ data: alertingSettings, isLoading: isAlertingSettingsLoading }, { data: notifications, isLoading: isNotificationsLoading }] =
    useQueries({
      queries: [
        {
          queryKey: ['workspace-alerting-settings', selectedWorkspace?.id],
          queryFn: getWorkspaceAlertingSettingsQuery,
          enabled: !!selectedWorkspace?.id,
        },
        {
          queryKey: ['workspace-notifications', selectedWorkspace?.id],
          queryFn: getWorkspaceNotificationsQuery,
          enabled: !!selectedWorkspace?.id,
        },
      ],
    })
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: putWorkspaceAlertingSettingsQuery,
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-alerting-settings',
      })
    },
  })
  const selectedSeverities = useRef<Record<string, SeverityType>>({})
  useEffect(() => {
    if (alertingSettings && benchmarks) {
      benchmarks.forEach((benchmark) => {
        selectedSeverities.current[benchmark.id] = alertingSettings[benchmark.id]?.severity ?? 'critical'
      })
    }
  }, [alertingSettings, benchmarks])
  const handleSelectedSeverity = (severity: SeverityType, benchmark: string) => {
    if (alertingSettings?.[benchmark] && selectedWorkspace?.id) {
      const body = { ...alertingSettings, [benchmark]: { channels: [...alertingSettings[benchmark].channels], severity } }
      mutate(
        { workspaceId: selectedWorkspace.id, body },
        {
          onSuccess: () => {
            queryClient.setQueryData(['workspace-alerting-settings', selectedWorkspace?.id], body)
          },
        },
      )
    }
    selectedSeverities.current[benchmark] = severity
  }
  const handleCheckboxChange = (benchmark: string, channel: NotificationChannel, checked: boolean) => {
    if (alertingSettings && selectedWorkspace?.id) {
      if (alertingSettings[benchmark] || checked) {
        const channels = alertingSettings[benchmark]
          ? checked
            ? [...alertingSettings[benchmark].channels, channel]
            : [...alertingSettings[benchmark].channels.filter((i) => i !== channel)]
          : checked
            ? [channel]
            : []
        const body = { ...alertingSettings, [benchmark]: { channels: channels, severity: selectedSeverities.current[benchmark] } }
        if (!body[benchmark].channels.length) {
          delete body[benchmark]
        }
        mutate(
          {
            workspaceId: selectedWorkspace?.id,
            body,
          },
          {
            onSuccess: () => {
              queryClient.setQueryData(['workspace-alerting-settings', selectedWorkspace?.id], body)
            },
          },
        )
      }
    }
  }
  const isLoading = isBenchmarksLoading || isNotificationsLoading || isAlertingSettingsLoading

  const hasData = Boolean(notifications && Object.keys(notifications).length && benchmarks?.length)
  return isLoading ? (
    <Box height={200} width="100%">
      <LoadingSuspenseFallback />
    </Box>
  ) : hasData ? (
    <TableContainer component={Paper}>
      <Table aria-label={t`Workspace Alerting Settings`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Benchmark</Trans>
            </TableCell>
            <TableCell>
              <Trans>Severity</Trans>
            </TableCell>
            {notifications?.email ? <TableCell>Email</TableCell> : undefined}
            {notifications?.slack ? <TableCell>Slack</TableCell> : undefined}
            {notifications?.teams ? <TableCell>Teams</TableCell> : undefined}
            {notifications?.discord ? <TableCell>Discord</TableCell> : undefined}
            {notifications?.pagerduty ? <TableCell>PagerDuty</TableCell> : undefined}
            {notifications?.opsgenie ? <TableCell>Opsgenie</TableCell> : undefined}
          </TableRow>
        </TableHead>
        <TableBody>
          {benchmarks?.map(({ id: benchmarkId, title: benchmarkTitle }, i) => (
            <TableRow key={i}>
              <TableCell>{benchmarkTitle}</TableCell>
              <TableCell>
                {hasPermission ? (
                  <Autocomplete
                    options={severityOptions}
                    disabled={isPending || !hasPermission}
                    size="small"
                    renderOption={(
                      { key, ...props }: HTMLAttributes<HTMLLIElement> & { key?: string },
                      option,
                      { inputValue: _, ...state },
                    ) =>
                      option ? (
                        <ListItemButton
                          component="li"
                          {...props}
                          {...state}
                          key={key}
                          sx={{
                            '&:hover ~ &': {
                              textDecoration: 'none',
                              bgcolor: 'action.hover',
                              // Reset on touch devices, it doesn't add specificity
                              '@media (hover: none)': {
                                backgroundColor: 'transparent',
                              },
                            },
                          }}
                        >
                          <Typography color={getColorBySeverity(option.value)}>{option.label}</Typography>
                        </ListItemButton>
                      ) : (
                        ''
                      )
                    }
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    disablePortal
                    disableClearable
                    fullWidth
                    onChange={(_, severity) => handleSelectedSeverity(severity.value, benchmarkId)}
                    defaultValue={severityOptions.find((i) => i.value === alertingSettings?.[benchmarkId]?.severity) ?? severityOptions[3]}
                    renderInput={(params) => <TextField {...params} label={<Trans>Severity</Trans>} />}
                  />
                ) : (
                  <Typography>
                    {(severityOptions.find((i) => i.value === alertingSettings?.[benchmarkId]?.severity) ?? severityOptions[3]).label}
                  </Typography>
                )}
              </TableCell>
              {notifications?.email ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmarkId}
                    checked={(alertingSettings?.[benchmarkId]?.channels.indexOf('email') ?? -1) > -1}
                    isPending={isPending}
                    name="email"
                    onChange={handleCheckboxChange}
                    hasPermission={hasPermission}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.slack ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmarkId}
                    checked={(alertingSettings?.[benchmarkId]?.channels.indexOf('slack') ?? -1) > -1}
                    isPending={isPending}
                    name="slack"
                    onChange={handleCheckboxChange}
                    hasPermission={hasPermission}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.teams ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmarkId}
                    checked={(alertingSettings?.[benchmarkId]?.channels.indexOf('teams') ?? -1) > -1}
                    isPending={isPending}
                    name="teams"
                    onChange={handleCheckboxChange}
                    hasPermission={hasPermission}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.discord ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmarkId}
                    checked={(alertingSettings?.[benchmarkId]?.channels.indexOf('discord') ?? -1) > -1}
                    isPending={isPending}
                    name="discord"
                    onChange={handleCheckboxChange}
                    hasPermission={hasPermission}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.pagerduty ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmarkId}
                    checked={(alertingSettings?.[benchmarkId]?.channels.indexOf('pagerduty') ?? -1) > -1}
                    isPending={isPending}
                    name="pagerduty"
                    onChange={handleCheckboxChange}
                    hasPermission={hasPermission}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.opsgenie ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmarkId}
                    checked={(alertingSettings?.[benchmarkId]?.channels.indexOf('opsgenie') ?? -1) > -1}
                    isPending={isPending}
                    name="opsgenie"
                    onChange={handleCheckboxChange}
                    hasPermission={hasPermission}
                  />
                </TableCell>
              ) : undefined}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Stack>
      <Alert severity={benchmarks?.length ? 'warning' : 'info'}>
        {benchmarks?.length ? (
          <Trans>
            Currently, there are no connected services available for configuration. Please be informed that connecting at least one service
            is necessary to configure alerting settings.
          </Trans>
        ) : (
          <Trans>
            We are currently trying to list your projects. Please stay tuned - we will send you an Email when cloud accounts have been
            collected
          </Trans>
        )}
      </Alert>
    </Stack>
  )
}
