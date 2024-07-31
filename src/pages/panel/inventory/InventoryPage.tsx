import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { parseISO8601Duration } from 'src/shared/utils/parseDuration'
import { getWorkspaceInventoryWorkspaceInfoQuery } from './getWorkspaceInventoryWorkspaceInfo.query'
import { InventoryInfoOverallScore } from './InventoryInfoOverallScore'
import { InventoryInfoResourceChangesTable } from './InventoryInfoResourceChangesTable'
import { InventoryInfoResourcesPerAccountTimeline } from './InventoryInfoResourcesPerAccountTimeline'
import { InventoryInfoResourcesTable } from './InventoryInfoResourcesTable'

export default function InventorySummaryPage() {
  const { selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const {
    data: {
      buckets_objects_progress,
      buckets_size_bytes_progress,
      cores_progress,
      databases_bytes_progress,
      databases_progress,
      instances_progress,
      memory_progress,
      resource_changes,
      resources_per_account_timeline,
      score_progress,
      volume_bytes_progress,
      volumes_progress,
    },
  } = useSuspenseQuery({
    queryFn: getWorkspaceInventoryWorkspaceInfoQuery,
    queryKey: ['workspace-inventory-workspace-info', selectedWorkspace?.id],
  })
  const accountCounts = resources_per_account_timeline.groups.length
  const duration = parseISO8601Duration(resources_per_account_timeline.granularity).duration
  const durationName = duration > 1000 * 60 * 60 * 24 * 27 ? t`month` : t`week`
  const isBad = !score_progress[1] ? null : score_progress[1] < 0
  return (
    <Stack spacing={1}>
      <Typography variant="h3">
        <Trans>Inventory Summary</Trans>
      </Typography>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1}>
        <Stack spacing={1} flex={0.5}>
          <Typography variant="h4">
            <Trans>Workspace: "{selectedWorkspace?.name}"</Trans>
          </Typography>
          <Typography>
            <Trans>
              Fix collected information from <b>{accountCounts} cloud accounts</b>.
            </Trans>
          </Typography>
          <Typography variant="h4">
            <Trans>Security score</Trans>
          </Typography>
          <Typography>
            The current weighted security score across all accounts stands at{' '}
            <Typography component="b" fontWeight="bold" color={isBad ? 'error.main' : isBad === false ? 'success.main' : 'primary'}>
              {score_progress[0]}
            </Typography>
            .<br />
            {isBad ? (
              <Trans>
                This represents a decline of{' '}
                <Typography component="b" fontWeight="bold" color="warning.main">
                  {score_progress[1]}
                </Typography>{' '}
                points over the last {durationName}.<br />
                <Typography component="b" fontWeight="bold" color="warning.main">
                  It's time to take action!
                </Typography>
                The Fix dashboard provides you with detailed information about what needs to be done to improve your security score.
              </Trans>
            ) : isBad === false ? (
              <Trans>
                This marks an improvement of{' '}
                <Typography component="b" fontWeight="bold" color="success.main">
                  {score_progress[1]}
                </Typography>{' '}
                points over the last {durationName}.<br />
                <Typography component="b" fontWeight="bold" color="success.main">
                  Excellent progress!
                </Typography>{' '}
                Keep up the good work.
              </Trans>
            ) : (
              <Trans>There has been no change in the score over the last {durationName}.</Trans>
            )}
          </Typography>
          <InventoryInfoOverallScore score={score_progress[0]} title={t`Security Score over all ${accountCounts}`} />
          <Stack spacing={1} flex={0.5}>
            <Typography variant="h4">
              <Trans>Resource Changes</Trans>
            </Typography>
            <Typography>
              <Trans>Fix has recorded the following changes in your infrastructure over the past {durationName}:</Trans>
            </Typography>
            <InventoryInfoResourceChangesTable changes={resource_changes} />
          </Stack>
        </Stack>
        <Stack spacing={1} flex={0.5}>
          <Typography variant="h4">
            <Trans>Resources</Trans>
          </Typography>
          <Typography>
            <Trans>
              The diagram below displays compute and database resources. This information is usually a valuable indicator, providing
              insights into cloud usage across various scenarios.
            </Trans>
          </Typography>
          <InventoryInfoResourcesTable
            buckets_objects_progress={buckets_objects_progress}
            buckets_size_bytes_progress={buckets_size_bytes_progress}
            cores_progress={cores_progress}
            databases_bytes_progress={databases_bytes_progress}
            databases_progress={databases_progress}
            instances_progress={instances_progress}
            memory_progress={memory_progress}
            volume_bytes_progress={volume_bytes_progress}
            volumes_progress={volumes_progress}
            locale={locale}
          />
        </Stack>
      </Stack>
      <Stack spacing={1} flex={0.5}>
        <Typography variant="h4">
          <Trans>Resources under control</Trans>
        </Typography>
        <Typography>
          <Trans>
            This diagram provides a breakdown of the total number of resources by cloud account over the past {durationName}. It is
            important to analyze any spikes in the diagram to understand their origins. Additionally, please note that an increase in the
            number of resources over time typically leads to higher costs.
          </Trans>
        </Typography>
        <InventoryInfoResourcesPerAccountTimeline data={resources_per_account_timeline} />
      </Stack>
    </Stack>
  )
}
