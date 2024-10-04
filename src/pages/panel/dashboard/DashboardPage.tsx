import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { Book4Icon, GlobeIcon, MovieIcon, ScheduleIcon } from 'src/assets/icons'
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
      data: { countries, data: worldMapDataWithCountries, regions },
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
            ({ data, countries, regions }, item) => {
              const country = findCountryBasedOnCoordinates(item) ?? ''
              return {
                data: [...data, { ...item, country }],
                countries: countries.includes(country) ? countries : [...countries, country],
                regions: { ...regions, [item.group.cloud]: (regions[item.group.cloud] ?? 0) + 1 },
              }
            },
            {
              data: [] as (PostWorkspaceInventoryAggregateForDashboardItem & {
                country?: string
              })[],
              countries: [] as string[],
              regions: {} as Record<AccountCloud, number | undefined>,
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
      <HelpSlider
        data={[
          {
            content: (
              <Box>
                <Typography variant="subtitle1">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
                <ul>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    <b>Lorem Ipsum</b> has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                    galley of type.
                  </Typography>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    <b>It has survived</b> not only five centuries, but also the leap into electronic typesetting, remaining essentially
                    unchanged.
                  </Typography>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    It as <b>popularized</b> in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                  </Typography>
                </ul>
              </Box>
            ),
            buttons: [
              {
                Icon: Book4Icon,
                text: <Trans>Read about inventory</Trans>,
                url: '1',
              },
              {
                Icon: Book4Icon,
                text: <Trans>Read documentation</Trans>,
                url: '2',
              },
              {
                Icon: MovieIcon,
                text: <Trans>Watch Video</Trans>,
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
            ],
          },
          {
            content: (
              <Box>
                <Typography variant="subtitle1">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
                <ul>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    <b>Lorem Ipsum</b> has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                    galley of type.
                  </Typography>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    <b>It has survived</b> not only five centuries, but also the leap into electronic typesetting, remaining essentially
                    unchanged.
                  </Typography>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    It as <b>popularized</b> in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                  </Typography>
                </ul>
              </Box>
            ),
            buttons: [
              {
                Icon: MovieIcon,
                text: <Trans>Watch Video</Trans>,
                url: 'https://discord.com/channels/@me/1148600794740957225/1287834370022969405',
              },
            ],
          },
          {
            content: (
              <Box>
                <Typography variant="subtitle1">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
                <ul>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    <b>Lorem Ipsum</b> has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                    galley of type.
                  </Typography>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    <b>It has survived</b> not only five centuries, but also the leap into electronic typesetting, remaining essentially
                    unchanged.
                  </Typography>
                  <Typography variant="subtitle1" component="li" mt={1}>
                    It as <b>popularized</b> in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                  </Typography>
                </ul>
              </Box>
            ),
          },
        ]}
      >
        <Trans>Infrastructure Overview</Trans>
      </HelpSlider>
      <DashboardCard
        SubtitleIcon={splittedLastScan ? ScheduleIcon : undefined}
        subtitle={
          lastScan && splittedLastScan ? (
            <Tooltip title={`Last scanned on ${splittedLastScan[0].substring(2)} @ ${splittedLastScan[1].split('.')[0]} UTC`}>
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
            {((awsResources ?? 0) + (azureResources ?? 0) + (gcpResources ?? 0)).toLocaleString(locale)} resources in{' '}
            {worldMapDataWithCountries.length.toLocaleString(locale)} regions in {countries.length.toLocaleString(locale)} countries
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
