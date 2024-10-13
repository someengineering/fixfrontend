import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Stack, Tooltip } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { GlobeIcon, ScheduleIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared/queries'
import { HelpSlider } from 'src/shared/right-slider'
import {
  GetWorkspaceCloudAccountsResponse,
  PostWorkspaceInventoryAggregateForDashboardItem,
  PostWorkspaceInventoryAggregateForDashboardResponse,
  PostWorkspaceInventorySearchForDashboardResponse,
} from 'src/shared/types/server'
import { AccountCloud } from 'src/shared/types/server-shared'
import { LiteralUnion } from 'src/shared/types/shared'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { DashboardCard } from './DashboardCard'
import { DashboardCloudCards } from './DashboardCloudCards'
import { DashboardPaper } from './DashboardPaper'
import { DashboardResourceChanges } from './DashboardResourceChanges'
import { WorldMap } from './WorldMap'
import { findCountryBasedOnCoordinates } from './findCountryBasedOnCoordinates'
import { getSlides } from './getSlides'
import { postWorkspaceInventoryAggregateForDashboardQuery } from './postWorkspaceInventoryAggregateForDashboard.query'
import { postWorkspaceInventorySearchForDashboardQuery } from './postWorkspaceInventorySearchForDashboard.query'

export default function DashboardPage() {
  const { selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const [
    { data: lastScan },
    {
      data: { countries, data: worldMapDataWithCountries, regions, resources: regionBasedResources },
    },
    {
      data: {
        aws: { accounts: awsAccounts, resources: awsResources, ...awsResourceTypes } = { accounts: undefined, resources: undefined },
        azure: { accounts: azureAccounts, resources: azureResources, ...azureResourceTypes } = {
          accounts: undefined,
          resources: undefined,
        },
        gcp: { accounts: gcpAccounts, resources: gcpResources, ...gcpResourceTypes } = { accounts: undefined, resources: undefined },
      },
    },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
        queryFn: getWorkspaceCloudAccountsQuery,
        select: (data: string | GetWorkspaceCloudAccountsResponse | undefined) =>
          typeof data === 'object'
            ? [...data.added, ...data.discovered, ...data.recent]
                .reduce(
                  (prev, account) =>
                    account.last_scan_finished_at && new Date(account.last_scan_finished_at) > prev
                      ? new Date(account.last_scan_finished_at)
                      : prev,
                  new Date(0),
                )
                .toISOString()
            : undefined,
      },
      {
        queryKey: ['workspace-inventory-aggregate-for-dashboard', selectedWorkspace?.id],
        queryFn: postWorkspaceInventoryAggregateForDashboardQuery,
        select: (data: PostWorkspaceInventoryAggregateForDashboardResponse) =>
          data.reduce(
            ({ data, countries, regions, resources }, item) => {
              const country = findCountryBasedOnCoordinates(item) ?? ''
              return {
                data: [...data, { ...item, country }],
                countries: countries.includes(country) ? countries : [...countries, country],
                regions: { ...regions, [item.group.cloud]: (regions[item.group.cloud] ?? 0) + 1 },
                resources: resources + item.resource_count,
              }
            },
            {
              data: [] as (PostWorkspaceInventoryAggregateForDashboardItem & {
                country?: string
              })[],
              countries: [] as string[],
              regions: {} as Record<AccountCloud, number | undefined>,
              resources: 0,
            },
          ),
      },
      {
        queryKey: ['workspace-inventory-search-for-dashboard', selectedWorkspace?.id],
        queryFn: postWorkspaceInventorySearchForDashboardQuery,
        select: (data: PostWorkspaceInventorySearchForDashboardResponse) => {
          const cloudData = {} as Record<AccountCloud, Record<LiteralUnion<'accounts' | 'resources', string>, number> | undefined>
          data.forEach(({ metadata, ancestors }) => {
            const cloud = ancestors.cloud.reported.name
            cloudData[cloud] = {
              ...cloudData[cloud],
              ...(metadata.descendant_summary ?? {}),
              accounts: (cloudData[cloud]?.accounts ?? 0) + 1,
              resources: (cloudData[cloud]?.resources ?? 0) + (metadata.descendant_count ?? 0),
            }
          })
          return cloudData
        },
      },
    ],
  })
  const splittedLastScan = lastScan ? lastScan.split('T') : undefined

  return (
    <Stack spacing={3.75}>
      <HelpSlider slides={getSlides}>
        <Trans>Infrastructure Overview</Trans>
      </HelpSlider>
      <DashboardCard
        SubtitleIcon={splittedLastScan ? ScheduleIcon : undefined}
        subtitle={
          lastScan && splittedLastScan ? (
            <Tooltip arrow title={`Last scanned on ${splittedLastScan[0].substring(2)} @ ${splittedLastScan[1].split('.')[0]} UTC`}>
              <span>
                <Trans>
                  Last scanned: {iso8601DurationToString(diffDateTimeToDuration(new Date(), new Date(lastScan)), 1).toLowerCase()} ago
                </Trans>
              </span>
            </Tooltip>
          ) : undefined
        }
        title={<Trans>Asset summary</Trans>}
      >
        <Stack direction="row" gap={3} flexWrap={{ xs: 'wrap', lg: 'nowrap' }}>
          <DashboardCloudCards
            cloud="aws"
            accounts={awsAccounts ?? 0}
            regions={regions.aws ?? 0}
            resourceTypes={Object.keys(awsResourceTypes ?? {}).length}
            resources={awsResources ?? 0}
          />
          <DashboardCloudCards
            cloud="gcp"
            accounts={gcpAccounts ?? 0}
            regions={regions.gcp ?? 0}
            resourceTypes={Object.keys(gcpResourceTypes ?? {}).length}
            resources={gcpResources ?? 0}
          />
          <DashboardCloudCards
            cloud="azure"
            accounts={azureAccounts ?? 0}
            regions={regions.azure ?? 0}
            resourceTypes={Object.keys(azureResourceTypes ?? {}).length}
            resources={azureResources ?? 0}
          />
        </Stack>
      </DashboardCard>
      <DashboardCard title={<Trans>Resources</Trans>}>
        <DashboardPaper>
          <DashboardResourceChanges />
        </DashboardPaper>
      </DashboardCard>
      <DashboardCard
        title={<Trans>Assets by region</Trans>}
        subtitle={
          <Trans>
            {regionBasedResources.toLocaleString(locale)} resources in {worldMapDataWithCountries.length.toLocaleString(locale)} regions,{' '}
            {countries.length.toLocaleString(locale)} countries
          </Trans>
        }
        SubtitleIcon={GlobeIcon}
      >
        <DashboardPaper>
          <WorldMap data={worldMapDataWithCountries} countries={countries} />
        </DashboardPaper>
      </DashboardCard>
    </Stack>
  )
}
