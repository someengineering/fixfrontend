import { Trans } from '@lingui/macro'
import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { sortedSeverities } from 'src/shared/constants'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { BenchmarkReportNode } from 'src/shared/types/server'
import { NodeType } from 'src/shared/types/server-shared'
import { BenchmarkCheckCollectionNodeWithChildren } from './BenchmarkDetailTreeItem'
import { BenchmarkDetailTreeWithDetail } from './BenchmarkDetailTreeWithDetail'
import { getWorkspaceInventoryReportBenchmarkQuery } from './getWorkspaceInventoryReportBenchmarkResult.query'

export const BenchmarkDetailTree = () => {
  const [count, setCount] = useState(0)
  const navigate = useAbsoluteNavigate()
  const { selectedWorkspace } = useUserProfile()
  const { accountId, benchmarkId, checkId } = useParams<'benchmarkId' | 'accountId' | 'checkId'>()

  const { data, isLoading } = useQuery({
    queryFn: getWorkspaceInventoryReportBenchmarkQuery,
    queryKey: ['workspace-inventory-report-benchmark', selectedWorkspace?.id, benchmarkId, accountId, undefined, undefined],
    enabled: !!(selectedWorkspace?.id && benchmarkId),
  })

  const [benchmarkDetail, dataWithChildren, allData, accountName] = useMemo(() => {
    let benchmarkDetail: NodeType<{ reported: BenchmarkReportNode }> | undefined
    let accountName = accountId
    const workingData: Record<string, BenchmarkCheckCollectionNodeWithChildren> = {}
    data?.forEach((item) => {
      if (item.type === 'node') {
        if (item.reported.kind === 'report_check_collection' || item.reported.kind === 'report_check_result') {
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
              ? { reported: item.reported, nodeId: item.id, children: [], numberOfResourceFailing: 0 }
              : {
                  reported: item.reported,
                  nodeId: item.id,
                  numberOfResourceFailing: item.reported.number_of_resources_failing ?? 0,
                  severity: item.reported.severity,
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
          if (!from.severity || (to.severity && sortedSeverities.indexOf(to.severity) < sortedSeverities.indexOf(from.severity))) {
            from.severity = to.severity
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
    ]
  }, [accountId, data])

  return (
    <>
      <Typography
        variant="h5"
        flexShrink={1}
        onClick={() => {
          if (checkId) {
            navigate('../..')
          }
          setCount((prev) => prev + 1)
        }}
        sx={{ cursor: 'pointer' }}
      >
        <Trans>Benchmark</Trans> {benchmarkDetail?.reported?.title || benchmarkDetail?.reported?.name || benchmarkId}
        {accountName ? (
          <>
            {' '}
            <Trans>in account</Trans> {accountName}
          </>
        ) : null}
      </Typography>
      {isLoading ? (
        <LoadingSuspenseFallback />
      ) : dataWithChildren && allData ? (
        <BenchmarkDetailTreeWithDetail
          key={count}
          benchmarkDetail={benchmarkDetail}
          accountId={accountId}
          benchmarkId={benchmarkId}
          checkId={checkId}
          dataWithChildren={dataWithChildren}
          allData={allData}
        />
      ) : null}
    </>
  )
}
