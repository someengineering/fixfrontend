import { t, Trans } from '@lingui/macro'
import { Button, FormControlLabel, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ZoomInMapIcon, ZoomOutMapIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { sortedSeverities } from 'src/shared/constants'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { IOSSwitch } from 'src/shared/switch'
import { BenchmarkReportNode } from 'src/shared/types/server'
import { NodeType } from 'src/shared/types/server-shared'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { ComplianceDetailTree } from './ComplianceDetailTree'
import { ComplianceCheckCollectionNodeWithChildren } from './ComplianceDetailTreeItem'
import { ComplianceDownloadButton } from './ComplianceDownloadButton'
import { CompliancePassedChecksCard } from './CompliancePassedChecksCard'
import { CompliancePostureCard } from './CompliancePostureCard'
import { getWorkspaceInventoryReportBenchmarkResultQuery } from './getWorkspaceInventoryReportBenchmarkResult.query'

export const ComplianceDetail = () => {
  const [showEmpty, setShowEmpty] = useState(false)
  const navigate = useAbsoluteNavigate()
  const { selectedWorkspace } = useUserProfile()
  const { accountId, benchmarkId, checkId } = useParams<'benchmarkId' | 'accountId' | 'checkId'>()

  const { data: [benchmarkDetail, dataWithChildren, allData, accountName, passedChecks, totalChecks, originalData] = [] } =
    useSuspenseQuery({
      queryKey: ['workspace-inventory-report-benchmark-result', selectedWorkspace?.id, benchmarkId, accountId, undefined, undefined],
      queryFn: getWorkspaceInventoryReportBenchmarkResultQuery,
      select: (data) => {
        let benchmarkDetail: NodeType<{ reported: BenchmarkReportNode }> | undefined
        let accountName = accountId
        const workingData: Record<string, ComplianceCheckCollectionNodeWithChildren> = {}
        let passedChecks = 0
        let totalChecks = 0
        data?.forEach((item) => {
          if (item.type === 'node') {
            if (item.reported.kind === 'report_check_collection' || item.reported.kind === 'report_check_result') {
              if (item.reported.kind === 'report_check_result') {
                totalChecks++
                if (item.reported.number_of_resources_failing === 0) {
                  passedChecks++
                }
              }
              if (
                accountId &&
                accountName === accountId &&
                item.reported.kind === 'report_check_result' &&
                item.reported.resources_failing_by_account?.[accountId]
              ) {
                accountName = item.reported.resources_failing_by_account[accountId][0].account
              }
              workingData[item.id] =
                item.reported.kind === 'report_check_collection'
                  ? {
                      reported: item.reported,
                      nodeId: item.id,
                      children: [],
                      numberOfResourceFailing: 0,
                      numberOfChecksFailing: 0,
                      totalChecks: 0,
                      isManual: true,
                    }
                  : {
                      reported: item.reported,
                      nodeId: item.id,
                      numberOfResourceFailing: item.reported.number_of_resources_failing ?? 0,
                      numberOfChecksFailing: item.reported.number_of_resources_failing === 0 || item.reported.detect.manual ? 0 : 1,
                      totalChecks: item.reported.detect.manual ? 0 : 1,
                      severity: item.reported.severity,
                      isManual: !!item.reported.detect.manual,
                    }
            } else {
              benchmarkDetail = item as NodeType<{ reported: BenchmarkReportNode }> | undefined
            }
          } else {
            const from = workingData[item.from]
            const to = workingData[item.to]
            if (from && to) {
              if (from.children) {
                from.children.push(to)
              } else {
                from.children = [to]
              }
              from.numberOfResourceFailing += to.numberOfResourceFailing
              from.numberOfChecksFailing += to.numberOfChecksFailing
              from.totalChecks += to.totalChecks
              if (
                to.severity &&
                to.numberOfResourceFailing &&
                (!from.severity || sortedSeverities.indexOf(to.severity) < sortedSeverities.indexOf(from.severity))
              ) {
                from.severity = to.severity
              }
              if (!to.isManual) {
                from.isManual = false
              }
              to.parent = from
            }
          }
        })
        return [
          benchmarkDetail,
          Object.values(workingData).filter((item) => item.reported.kind === 'report_check_collection' && !item.parent),
          workingData,
          accountName,
          passedChecks,
          totalChecks,
          data,
        ] as const
      },
      structuralSharing: false,
    })
  const condenseAll = () => {
    const searches = getLocationSearchValues()
    delete searches['expanded-items']
    const prevSearch = window.location.search
    const newPathname = window.location.pathname?.split('?')?.[0]?.split('#')?.[0]
    const newSearch = mergeLocationSearchValues(searches)
    if (prevSearch !== newSearch) {
      navigate({ pathname: newPathname, search: newSearch })
    }
  }
  const expandAll = () => {
    const searches = getLocationSearchValues()
    if (allData) {
      searches['expanded-items'] = Object.keys(allData).join(',')
    } else {
      delete searches['expanded-items']
    }
    const prevSearch = window.location.search
    const newPathname = window.location.pathname?.split('?')?.[0]?.split('#')?.[0]
    const newSearch = mergeLocationSearchValues(searches)
    if (prevSearch !== newSearch) {
      navigate({ pathname: newPathname, search: newSearch })
    }
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={3} direction={{ xs: 'column', lg: 'row' }}>
        <CompliancePassedChecksCard passedChecks={passedChecks ?? 0} totalChecks={totalChecks ?? 0} />
        <CompliancePostureCard passedChecks={passedChecks ?? 0} totalChecks={totalChecks ?? 0} />
      </Stack>
      <Stack sx={{ overFlowX: 'auto' }} minWidth={1380}>
        <Stack direction="row" py={2} spacing={1} alignItems="center" justifyContent="space-between" color="textPrimary">
          <Typography variant="h4">
            <Trans>{dataWithChildren?.length} categories</Trans>
          </Typography>
          <Stack direction="row" alignItems="center" spacing={3.75}>
            <FormControlLabel
              control={<IOSSwitch checked={showEmpty} onChange={(e) => setShowEmpty(e.target.checked)} />}
              label={
                <Typography variant="subtitle1" fontWeight={500}>
                  <Trans>Show empty categories</Trans>
                </Typography>
              }
            />
            <Button startIcon={<ZoomInMapIcon />} color="inherit" sx={{ p: 0 }} onClick={condenseAll}>
              <Trans>Condense all</Trans>
            </Button>
            <Button startIcon={<ZoomOutMapIcon />} color="inherit" sx={{ p: 0 }} onClick={expandAll}>
              <Trans>Expand all</Trans>
            </Button>
            {originalData && (
              <ComplianceDownloadButton
                data={originalData}
                filename={t`${benchmarkDetail?.reported.framework}_${accountName}_${new Date().toISOString()}.json`}
              />
            )}
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          color="textSecondary"
          spacing={1}
          py={1.5}
          borderTop={({ palette }) => `1px solid ${palette.divider}`}
        >
          <Typography variant="subtitle1" color="textSecondary" flex={1} flexShrink={0}>
            <Trans>Account name</Trans>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" flex={0} flexShrink={0} minWidth={360}>
            <Trans>Compliance posture</Trans>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" flex={0} flexShrink={0} minWidth={224}>
            <Trans>Passed checks</Trans>
          </Typography>
        </Stack>
        <Stack>
          {allData && dataWithChildren ? (
            <ComplianceDetailTree
              allData={allData}
              dataWithChildren={
                dataWithChildren.length === 1 && dataWithChildren[0].children ? dataWithChildren[0].children : dataWithChildren
              }
              accountId={accountId}
              benchmarkId={benchmarkId}
              checkId={checkId}
              showEmpty={showEmpty}
            />
          ) : (
            <LoadingSuspenseFallback />
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
