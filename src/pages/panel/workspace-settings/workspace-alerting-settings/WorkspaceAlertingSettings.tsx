import { Trans, t } from '@lingui/macro'
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
import { useEffect, useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceNotificationsQuery } from 'src/pages/panel/shared/queries'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { NotificationChannel, SeverityType } from 'src/shared/types/server'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { getWorkspaceAlertingSettingsQuery } from './getWorkspaceAlertingSettings.query'
import { getWorkspaceInventoryReportInfoQuery } from './getWorkspaceInventoryReportInfo.query'
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
}

const WorkspaceAlertingSettingsCheckbox = ({ benchmark, checked, isPending, name, onChange }: WorkspaceAlertingSettingsCheckboxProps) => {
  return isPending ? (
    <Stack justifyContent="center" direction="column" padding={1} margin="1px">
      <CircularProgress size={20} />
    </Stack>
  ) : (
    <Checkbox checked={checked} onChange={(e) => onChange(benchmark, name, e.target.checked)} />
  )
}

export const WorkspaceAlertingSettings = () => {
  const { selectedWorkspace } = useUserProfile()
  const [
    { data: reportInfo, isLoading: isReportInfoLoading },
    { data: alertingSettings, isLoading: isAlertingSettingsLoading },
    { data: notifications, isLoading: isNotificationsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ['workspace-inventory-report-info', selectedWorkspace?.id],
        queryFn: getWorkspaceInventoryReportInfoQuery,
        enabled: !!selectedWorkspace?.id,
      },
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
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-alerting-settings',
      })
    },
  })
  const selectedSeverities = useRef<Record<string, SeverityType>>({})
  useEffect(() => {
    if (alertingSettings && reportInfo) {
      reportInfo.benchmarks.forEach((benchmark) => {
        selectedSeverities.current[benchmark] = alertingSettings[benchmark]?.severity ?? 'critical'
      })
    }
  }, [alertingSettings, reportInfo])
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
  const isLoading = isReportInfoLoading || isNotificationsLoading || isAlertingSettingsLoading

  const hasData = Boolean(notifications && Object.keys(notifications).length)
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
          {reportInfo?.benchmarks.map((benchmark, i) => (
            <TableRow key={i}>
              <TableCell>{snakeCaseWordsToUFStr(benchmark)}</TableCell>
              <TableCell>
                <Autocomplete
                  options={severityOptions}
                  disabled={isPending}
                  size="small"
                  renderOption={(props, option, { inputValue: _, ...state }) =>
                    option ? (
                      <ListItemButton
                        component="li"
                        {...props}
                        {...state}
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
                  onChange={(_, severity) => handleSelectedSeverity(severity.value, benchmark)}
                  defaultValue={severityOptions.find((i) => i.value === alertingSettings?.[benchmark]?.severity) ?? severityOptions[3]}
                  renderInput={(params) => <TextField {...params} label={<Trans>Severity</Trans>} />}
                ></Autocomplete>
              </TableCell>
              {notifications?.email ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmark}
                    checked={(alertingSettings?.[benchmark]?.channels.indexOf('email') ?? -1) > -1}
                    isPending={isPending}
                    name="email"
                    onChange={handleCheckboxChange}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.slack ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmark}
                    checked={(alertingSettings?.[benchmark]?.channels.indexOf('slack') ?? -1) > -1}
                    isPending={isPending}
                    name="slack"
                    onChange={handleCheckboxChange}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.teams ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmark}
                    checked={(alertingSettings?.[benchmark]?.channels.indexOf('teams') ?? -1) > -1}
                    isPending={isPending}
                    name="teams"
                    onChange={handleCheckboxChange}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.discord ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmark}
                    checked={(alertingSettings?.[benchmark]?.channels.indexOf('discord') ?? -1) > -1}
                    isPending={isPending}
                    name="discord"
                    onChange={handleCheckboxChange}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.pagerduty ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmark}
                    checked={(alertingSettings?.[benchmark]?.channels.indexOf('pagerduty') ?? -1) > -1}
                    isPending={isPending}
                    name="pagerduty"
                    onChange={handleCheckboxChange}
                  />
                </TableCell>
              ) : undefined}
              {notifications?.opsgenie ? (
                <TableCell>
                  <WorkspaceAlertingSettingsCheckbox
                    benchmark={benchmark}
                    checked={(alertingSettings?.[benchmark]?.channels.indexOf('opsgenie') ?? -1) > -1}
                    isPending={isPending}
                    name="opsgenie"
                    onChange={handleCheckboxChange}
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
      <Alert color="warning">
        <Trans>
          Currently, there are no connected services available for configuration. Please be informed that connecting at least one service is
          necessary to configure alerting settings.
        </Trans>
      </Alert>
    </Stack>
  )
}
