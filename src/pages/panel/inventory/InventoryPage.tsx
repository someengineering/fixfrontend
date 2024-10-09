import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Box, ButtonBase, Divider, Stack, Typography } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { ReactNode, useMemo, useState } from 'react'
import { getNameAndIconFromMetadataGroup, StacksIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryModelQuery, postWorkspaceInventoryDescendantSummaryQuery } from 'src/pages/panel/shared/queries'
import { CloudToIcon } from 'src/shared/cloud-avatar'
import { HelpSlider } from 'src/shared/right-slider'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { DataGridPagination } from './DataGridPagination'
import { DownloadCSVButton } from './DownloadCSVButton'
import { getColumns, RowType } from './getColumns'
import { GridFilterItem } from './GridFilterItem'
import { postWorkspaceInventorySearchForInventoryQuery } from './postWorkspaceInventorySearchForInventory.query'
import { StyledDataGrid } from './StyledDataGrid'

const getString = (str?: null | string | string[]) => {
  return typeof str === 'string' && str ? str : null
}

export default function InventoryPage() {
  const { selectedWorkspace } = useUserProfile()
  const [cloudFilter, setCloudFilter] = useState<string[]>([])
  const [accountFilter, setAccountFilter] = useState<string[]>([])
  const [regionFilter, setRegionFilter] = useState<string[]>([])
  const [kindFilter, setKindFilter] = useState<string[]>([])
  const [groupFilter, setGroupFilter] = useState('')
  const {
    i18n: { locale },
  } = useLingui()
  const { data, groups, accounts, regions, clouds, kinds } = useSuspenseQueries({
    queries: [
      {
        queryKey: [
          'workspace-inventory-model',
          selectedWorkspace?.id,
          undefined,
          'aws_,gcp_,azure_',
          true,
          false,
          true,
          false,
          true,
          true,
          true,
        ],
        queryFn: getWorkspaceInventoryModelQuery,
      },
      {
        queryKey: [
          'workspace-inventory-descendant-summary',
          selectedWorkspace?.id,
          cloudFilter.join(','),
          accountFilter.join(','),
          regionFilter.join(','),
          kindFilter.join(','),
        ],
        queryFn: postWorkspaceInventoryDescendantSummaryQuery,
      },
      {
        queryKey: ['workspace-inventory-search-for-inventory', selectedWorkspace?.id],
        queryFn: postWorkspaceInventorySearchForInventoryQuery,
      },
    ],
    combine: ([
      { data },
      { data: counts },
      {
        data: [accountsData, regionsData],
      },
    ]) => {
      const groups = [{ id: '', Icon: StacksIcon, name: t`All resource kinds`, resources: 0 }]
      const clouds = [] as { value: string; title: string; kinds: string[]; Icon: ReactNode }[]
      const accounts = [] as { value: string; title: string; kinds: string[] }[]
      const regions = [] as { value: string; title: string; kinds: string[] }[]
      const kinds = [] as { value: string; title: string; kinds: string[] }[]
      const allData = data
        .filter((item) => counts[item.fqn]?.resources)
        .map((item) => {
          const group = 'metadata' in item ? getString(item.metadata?.group) : null
          const groupItem = group ? groups.find(({ id }) => id === group) : undefined
          if (groupItem) {
            groupItem.resources += counts[item.fqn]?.resources ?? 0
          } else if (group) {
            groups.push({ id: group, ...getNameAndIconFromMetadataGroup(group), resources: counts[item.fqn]?.resources ?? 0 })
          }

          groups[0].resources += counts[item.fqn]?.resources ?? 0
          const cloud = ('metadata' in item && getString(item.metadata?.source)) || item.fqn.split('_')[0].replace('microsoft', 'azure')
          const cloudItem = clouds.find(({ value }) => value === cloud)
          if (!cloudItem) {
            clouds.push({
              value: cloud,
              title: getAccountCloudName(cloud),
              kinds: [item.fqn],
              Icon: CloudToIcon({ cloud, height: 18, preserveAspectRatio: 'xMaxYMid meet' }),
            })
          } else if (!cloudItem.kinds.includes(item.fqn)) {
            cloudItem.kinds = [...cloudItem.kinds, item.fqn]
          }
          const kindItem = kinds.find(({ value }) => value === item.fqn)
          if (!kindItem) {
            kinds.push({
              value: item.fqn,
              title: ('metadata' in item && typeof item.metadata?.name === 'string' ? item.metadata?.name : undefined) || item.fqn,
              kinds: [item.fqn],
            })
          } else if (!kindItem.kinds.includes(item.fqn)) {
            kindItem.kinds = [...kindItem.kinds, item.fqn]
          }
          accountsData
            .filter((account) => account.metadata.descendant_summary?.[item.fqn])
            .forEach(({ reported: { id, name } }) => {
              const accountItem = accounts.find(({ value }) => value === id)
              if (!accountItem) {
                accounts.push({ value: id, title: name || id, kinds: [item.fqn] })
              } else if (!accountItem.kinds.includes(item.fqn)) {
                accountItem.kinds = [...accountItem.kinds, item.fqn]
              }
            })
          regionsData
            .filter((region) => region.metadata.descendant_summary?.[item.fqn])
            .forEach(({ reported: { id, name, long_name } }) => {
              const regionItem = regions.find(({ value }) => value === id)
              if (!regionItem) {
                regions.push({ value: id, title: long_name || name || id, kinds: [item.fqn] })
              } else if (!regionItem.kinds.includes(item.fqn)) {
                regionItem.kinds = [...regionItem.kinds, item.fqn]
              }
            })

          return {
            id: item.fqn,
            cloud,
            resources: counts[item.fqn]?.resources ?? 0,
            accounts: counts[item.fqn]?.accounts ?? 0,
            regions: counts[item.fqn]?.regions ?? 0,
            ...('metadata' in item
              ? {
                  categories: getString(
                    Array.isArray(item.metadata?.categories)
                      ? item.metadata?.categories
                          .map(getString)
                          .filter((i) => i)
                          .join(',')
                      : null,
                  ),
                  description: getString(item.metadata?.description),
                  group,
                  icon: getString(item.metadata?.icon),
                  name: getString(item.metadata?.name),
                  service: getString(item.metadata?.service),
                }
              : {
                  description: null,
                  group: null,
                  icon: null,
                  name: null,
                  service: null,
                }),
          } as RowType
        })
      return {
        data: allData,
        groups,
        accounts: accounts.sort((a, b) => a.title.localeCompare(b.title)),
        regions: regions.sort((a, b) => a.title.localeCompare(b.title)),
        clouds: clouds.sort((a, b) => a.title.localeCompare(b.title)),
        kinds: kinds.sort((a, b) => a.title.localeCompare(b.title)),
      }
    },
  })
  const rows = useMemo(() => (groupFilter ? data.filter(({ group }) => groupFilter === group) : data), [data, groupFilter])
  const columns = useMemo(() => getColumns(locale), [locale])
  return (
    <Stack
      direction="row"
      m={-3}
      height={({ spacing }) => `calc(100% + ${spacing(6)})`}
      width={({ spacing }) => `calc(100% + ${spacing(6)})`}
      flex={1}
      overflow="hidden"
    >
      <Box flex={0} height="100%">
        <Box>
          <Box py={3} px={3.75}>
            <HelpSlider data={[]}>
              <Trans>Inventory</Trans>
            </HelpSlider>
          </Box>
          <Divider />
          <Stack p={2.5} spacing={0.5}>
            {groups.map(({ Icon, id, name, resources }) => (
              <Stack
                direction="row"
                key={id}
                py={1}
                px={1.5}
                spacing={1}
                bgcolor={id === groupFilter ? 'background.default' : undefined}
                borderRadius="6px"
                component={ButtonBase}
                onClick={() => setGroupFilter(id)}
              >
                <Icon color={id === groupFilter ? 'primary.main' : undefined} />
                <Typography
                  variant="subtitle2"
                  fontWeight={id === groupFilter ? 500 : 400}
                  color={id === groupFilter ? 'primary.main' : undefined}
                  flex={1}
                  whiteSpace="nowrap"
                  textAlign="left"
                >
                  {name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={id === groupFilter ? 500 : 400}
                  color={id === groupFilter ? 'primary.main' : undefined}
                >
                  {resources.toLocaleString(locale)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
      <Divider orientation="vertical" />
      <Stack height="100%" flex={1} py={3.75} px={3.75} spacing={3}>
        <Stack direction="row" gap={2} flexWrap="wrap" flex={0}>
          <GridFilterItem items={clouds} name={t`clouds`} onChange={setCloudFilter} values={cloudFilter} />
          <GridFilterItem items={accounts} name={t`accounts`} onChange={setAccountFilter} values={accountFilter} />
          <GridFilterItem items={regions} name={t`regions`} onChange={setRegionFilter} values={regionFilter} />
          <GridFilterItem items={kinds} name={t`kinds`} onChange={setKindFilter} values={kindFilter} />
          <Stack flexGrow={1} alignItems="end">
            <DownloadCSVButton
              filename={`modal-data-${selectedWorkspace?.id}-${new Date().toISOString()}.csv`}
              data={[
                columns.map((item) => item.headerName),
                ...rows.map(({ name, id, service, group, resources, accounts, regions }) => [
                  `${name ?? id} - ${service ?? ''}`,
                  group,
                  resources,
                  accounts,
                  regions,
                ]),
              ]}
            />
          </Stack>
        </Stack>
        <Box height="100%" flex={1}>
          <StyledDataGrid
            disableRowSelectionOnClick
            columns={columns}
            rows={rows}
            pagination
            autoPageSize
            rowHeight={62}
            disableAggregation
            disableRowGrouping
            disableColumnFilter
            columnHeaderHeight={48}
            slots={{ pagination: DataGridPagination }}
          />
        </Box>
      </Stack>
    </Stack>
  )
}
