import { Trans } from '@lingui/macro'
import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery, getWorkspaceInventoryReportBenchmarksQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { GetWorkspaceCloudAccountsResponse, GetWorkspaceInventoryReportBenchmarksResponse } from 'src/shared/types/server'
import { getAccountName } from 'src/shared/utils/getAccountName'
import { ComplianceDetail } from './ComplianceDetail'

export const ComplianceSummary = () => {
  const { selectedWorkspace } = useUserProfile()
  const [{ data: benchmarks, isLoading: isBenchmarksLoading }, { data: accounts, isLoading: isAccountsLoading }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['workspace-inventory-report-benchmarks', selectedWorkspace?.id, undefined, true, false, false, true],
        queryFn: getWorkspaceInventoryReportBenchmarksQuery,
        select: (data: GetWorkspaceInventoryReportBenchmarksResponse) =>
          data.map((benchmark) => ({ title: benchmark.title, value: benchmark.id, clouds: benchmark.clouds })),
      },
      {
        queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
        queryFn: getWorkspaceCloudAccountsQuery,
        select: (data: string | GetWorkspaceCloudAccountsResponse | undefined) =>
          data && typeof data === 'object'
            ? [...data.added, ...data.discovered, ...data.recent].map((account) => ({
                title: getAccountName(account),
                value: account.account_id,
                cloud: account.cloud,
              }))
            : [],
      },
    ],
  })
  const isLoading = isBenchmarksLoading || isAccountsLoading
  const navigate = useAbsoluteNavigate()
  const { accountId = '', benchmarkId } = useParams<'benchmarkId' | 'accountId'>()
  const changeParams = (framework?: string, account: string | undefined = accountId) => {
    navigate(`/compliance/${framework ?? benchmarkId}${account ? `/${account}` : ''}`)
  }

  const setFramework = (framework: string) => {
    const newFrameworkClouds = benchmarks.find((benchmark) => benchmark.value === framework)?.clouds ?? []
    const currentAccountCloud = accounts.find((account) => account.value === accountId)?.cloud
    if (currentAccountCloud && newFrameworkClouds.includes(currentAccountCloud)) {
      changeParams(framework)
    } else {
      changeParams(framework, '')
    }
  }
  const setAccount = (account: string) => changeParams(undefined, account)

  const currentFrameworkClouds = benchmarks.find((benchmark) => benchmark.value === benchmarkId)?.clouds ?? []
  const cloudFilteredAccounts = currentFrameworkClouds.length
    ? accounts.filter((account) => currentFrameworkClouds.includes(account.cloud))
    : accounts

  return (
    <Stack
      direction="row"
      gap={3.75}
      alignItems="center"
      justifyContent="end"
      sx={{ overflowX: 'auto', overflowY: 'hidden' }}
      flexWrap="wrap"
    >
      <Stack direction="row" gap={3} alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          <Trans>By framework</Trans>
        </Typography>
        <Select
          value={benchmarkId ?? ''}
          onChange={(e) => setFramework(e.target.value)}
          sx={{ minWidth: 180, color: !benchmarkId ? ({ palette }) => palette.text.disabled : undefined }}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <Trans>Select one</Trans>
          </MenuItem>
          {benchmarks.map((benchmark) => (
            <MenuItem key={benchmark.value} value={benchmark.value}>
              {benchmark.title}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction="row" gap={3} alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          <Trans>By account</Trans>
        </Typography>
        <Select value={accountId} onChange={(e) => setAccount(e.target.value)} sx={{ minWidth: 180 }} displayEmpty>
          <MenuItem value="">
            <Trans>All accounts</Trans>
          </MenuItem>
          {cloudFilteredAccounts.map((account) => (
            <MenuItem key={account.value} value={account.value}>
              {account.title}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {isLoading ? (
        <LoadingSuspenseFallback />
      ) : benchmarks && accounts && benchmarkId ? (
        <NetworkErrorBoundary key={`${accounts}_${benchmarkId}`} FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingSuspenseFallback />}>
            <ComplianceDetail />
          </Suspense>
        </NetworkErrorBoundary>
      ) : null}
      {benchmarkId ? <Outlet /> : null}
    </Stack>
  )
}
