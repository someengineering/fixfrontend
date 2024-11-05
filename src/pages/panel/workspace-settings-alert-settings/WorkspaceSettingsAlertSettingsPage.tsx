import { Trans, t } from '@lingui/macro'
import { Alert, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { DiscordWithTextLogo, EmailWithTextIcon, OpsgenieLogo, PagerdutyLogo, SlackWithTextLogo, TeamsLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceNotificationsQuery } from 'src/pages/panel/shared/queries'
import { FrameworkIcon, useGetBenchmarks } from 'src/pages/panel/shared/utils'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { SeverityDropDown, SeverityItem } from 'src/shared/severity'
import { NotificationChannel, SeverityType } from 'src/shared/types/server-shared'
import { getWorkspaceAlertingSettingsQuery } from './getWorkspaceAlertingSettings.query'
import { putWorkspaceAlertingSettingsQuery } from './putWorkspaceAlertingSettings.query'
import { WorkspaceSettingsAlertSettingsCheckbox } from './WorkspaceSettingsAlertSettingsCheckbox'

export default function WorkspaceSettingsAlertSettingsPage() {
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
    <TableContainer>
      <Table aria-label={t`Workspace Alerting Settings`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Benchmark</Trans>
            </TableCell>
            <TableCell>
              <Trans>Severity</Trans>
            </TableCell>
            {notifications?.email ? (
              <TableCell width={100} sx={{ p: 0 }}>
                <Stack alignItems="center">
                  <EmailWithTextIcon height={16} color="primary.main" />
                </Stack>
              </TableCell>
            ) : undefined}
            {notifications?.slack ? (
              <TableCell width={100} sx={{ p: 0 }}>
                <Stack alignItems="center">
                  <SlackWithTextLogo height={16} color="common.black" />
                </Stack>
              </TableCell>
            ) : undefined}
            {notifications?.teams ? (
              <TableCell width={100} sx={{ p: 0 }}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                  <TeamsLogo height={16} color="primary.main" />
                  <Typography variant="body1" lineHeight="16px" fontSize="16px" fontWeight={700} color="common.black">
                    Teams
                  </Typography>
                </Stack>
              </TableCell>
            ) : undefined}
            {notifications?.discord ? (
              <TableCell width={100} sx={{ p: 0 }}>
                <Stack alignItems="center">
                  <DiscordWithTextLogo height={16} color="common.black" />
                </Stack>
              </TableCell>
            ) : undefined}
            {notifications?.pagerduty ? (
              <TableCell width={100} sx={{ p: 0 }}>
                <Stack alignItems="center">
                  <PagerdutyLogo height={16} color="common.black" />
                </Stack>
              </TableCell>
            ) : undefined}
            {notifications?.opsgenie ? (
              <TableCell width={100} sx={{ p: 0 }}>
                <Stack alignItems="center">
                  <OpsgenieLogo height={16} color="common.black" />
                </Stack>
              </TableCell>
            ) : undefined}
          </TableRow>
        </TableHead>
        <TableBody>
          {benchmarks?.map(({ id: benchmarkId, title: benchmarkTitle }, i) => (
            <TableRow key={i}>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FrameworkIcon frameworkId={benchmarkId} />
                  <Typography variant="subtitle1" fontWeight={500}>
                    {benchmarkTitle}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                {hasPermission ? (
                  <SeverityDropDown
                    value={alertingSettings?.[benchmarkId]?.severity ?? 'critical'}
                    onChange={(severity) => handleSelectedSeverity(severity, benchmarkId)}
                  />
                ) : (
                  <SeverityItem severity={alertingSettings?.[benchmarkId]?.severity ?? 'critical'} />
                )}
              </TableCell>
              {notifications?.email ? (
                <TableCell width={100} sx={{ p: 0 }}>
                  <WorkspaceSettingsAlertSettingsCheckbox
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
                <TableCell width={100} sx={{ p: 0 }}>
                  <WorkspaceSettingsAlertSettingsCheckbox
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
                <TableCell width={100} sx={{ p: 0 }}>
                  <WorkspaceSettingsAlertSettingsCheckbox
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
                <TableCell width={100} sx={{ p: 0 }}>
                  <WorkspaceSettingsAlertSettingsCheckbox
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
                <TableCell width={100} sx={{ p: 0 }}>
                  <WorkspaceSettingsAlertSettingsCheckbox
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
                <TableCell width={100} sx={{ p: 0 }}>
                  <WorkspaceSettingsAlertSettingsCheckbox
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
