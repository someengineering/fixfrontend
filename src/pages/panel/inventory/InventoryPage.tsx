import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { InternalLink, InternalLinkButton } from 'src/shared/link-button'
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
    <Stack spacing={5}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={5}>
        <Stack spacing={1} flex={0.5}>
          <Stack spacing={1} flex={0.5}>
            <Typography variant="h4">
              <Trans>Security score</Trans>
            </Typography>
            <Typography>
              {isBad ? (
                <Trans>
                  The current weighted security score has declined by{' '}
                  <Typography component="b" fontWeight="bold" color="warning.main">
                    {score_progress[1]}
                  </Typography>{' '}
                  points over the past {durationName}.<br />
                  <Typography component="b" fontWeight="bold" color="warning.main">
                    It's time to take action!
                  </Typography>
                  <br />
                  For more details, see the <InternalLink to="/security">Security Dashboard</InternalLink>.
                </Trans>
              ) : isBad === false ? (
                <Trans>
                  The current weighted security score has improved by{' '}
                  <Typography component="b" fontWeight="bold" color="success.main">
                    {score_progress[1]}
                  </Typography>{' '}
                  points over the past {durationName}.<br />
                  <Typography component="b" fontWeight="bold" color="success.main">
                    Excellent progress!
                  </Typography>{' '}
                  Keep up the good work.
                </Trans>
              ) : (
                <Trans>The current weighted security score did not change over the past {durationName}.</Trans>
              )}
            </Typography>
          </Stack>
          <Stack spacing={1} direction={{ xs: 'column', xl: 'row' }}>
            <Stack flex={0.5} alignItems="center">
              <InternalLinkButton to={{ pathname: '/security' }}>
                <InventoryInfoOverallScore score={score_progress[0]} title={t`Security Score over all ${accountCounts} cloud accounts`} />
              </InternalLinkButton>
            </Stack>
            <Stack flex={0.5} alignItems="center">
              <InventoryInfoResourceChangesTable
                changes={resource_changes}
                startDate={resources_per_account_timeline.start}
                endDate={resources_per_account_timeline.end}
              />
            </Stack>
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
      <Stack spacing={5} flex={0.5}>
        <Typography variant="h4">
          <Trans>Resources under control</Trans>
        </Typography>
        <InventoryInfoResourcesPerAccountTimeline data={resources_per_account_timeline} />
      </Stack>
    </Stack>
  )
}
