import { Trans, t } from '@lingui/macro'
import { Box, ButtonBase, Divider, Typography } from '@mui/material'
import { DataGridPremium, GridRow, GridToolbar } from '@mui/x-data-grid-premium'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { sortedSeverities } from 'src/shared/constants'
import { getMessage } from 'src/shared/defined-messages'
import { BenchmarkReportNode } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { BenchmarkCheckCollectionNodeWithChildren } from './BenchmarkDetailTreeItem'
import { getAllChildrenCheckResult } from './getAllChildrenCheckResult'

export interface BenchmarkDetailViewProps {
  benchmarkDetail: BenchmarkReportNode
  child: BenchmarkCheckCollectionNodeWithChildren[] | undefined
}

export const BenchmarkDetailView = ({ benchmarkDetail, child }: BenchmarkDetailViewProps) => {
  const navigate = useAbsoluteNavigate()
  const allChecks = getAllChildrenCheckResult(child)
  const allFailingCheckResults = allChecks.filter((i) => i.number_of_resources_failing)

  return (
    <>
      {benchmarkDetail.title ? (
        <Typography variant="h5" component="span">
          {benchmarkDetail.title}
        </Typography>
      ) : (
        <Typography variant="h5" component="span">
          {benchmarkDetail.name}
        </Typography>
      )}
      <Divider flexItem />
      <Box display="grid" gridTemplateColumns="max-content auto" gap={1}>
        {/* {benchmarkDetail.documentation ? (
        <>
          <Typography component="div">
            <Trans>Documentation</Trans>:
          </Typography>{' '}
          <Typography variant="h6" component="span">
            {benchmarkDetail.documentation}
          </Typography>
        </>
      ) : undefined} */}
        {benchmarkDetail.framework ? (
          <>
            <Typography variant="caption" component="div">
              <Trans>Framework</Trans>:
            </Typography>{' '}
            <Typography variant="caption" component="span">
              {benchmarkDetail.framework}
            </Typography>
          </>
        ) : undefined}
        {benchmarkDetail.version ? (
          <>
            <Typography variant="caption" component="div">
              <Trans>Version</Trans>:
            </Typography>{' '}
            <Typography variant="caption" component="span">
              {benchmarkDetail.version}
            </Typography>
          </>
        ) : undefined}
      </Box>
      <Divider flexItem />
      <Typography variant="h6" component="span">
        {benchmarkDetail.description}
      </Typography>
      <Divider flexItem />
      {allFailingCheckResults.length ? (
        <>
          <Typography variant="h6" mb={1}>
            <Trans>
              <Typography variant="h5" color="warning.main" component="span">
                {allFailingCheckResults.length} checks failing
              </Typography>{' '}
              out of {allChecks.length}
            </Trans>
          </Typography>
          <DataGridPremium
            disableRowSelectionOnClick
            autoPageSize
            sx={{ minHeight: 300, minWidth: 100 }}
            columns={[
              {
                field: 'severity',
                headerName: t`Severity`,
                type: 'singleSelect',
                width: 150,
                renderCell: ({ row }) =>
                  row.severity ? (
                    <Typography color={getColorBySeverity(row.severity)} pr={2} variant="caption" fontWeight={700}>
                      {getMessage(snakeCaseToUFStr(row.severity))}
                    </Typography>
                  ) : undefined,
                valueOptions: sortedSeverities,
                sortComparator: (value1: SeverityType, value2: SeverityType) =>
                  sortedSeverities.indexOf(value2) - sortedSeverities.indexOf(value1),
              },
              {
                field: 'number_of_resources_failing',
                headerName: t`Failing Resources`,
                width: 150,
                type: 'number',
              },
              {
                field: 'title',
                headerName: t`Check Name`,
                valueGetter: (_, row) => row.title ?? row.name,
                flex: 1,
              },
            ]}
            slots={{
              toolbar: GridToolbar,
              row: (rowProps) => (
                <ButtonBase
                  href={`./check-detail/${(rowProps.row as (typeof allFailingCheckResults)[number])?.checkId}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(`./check-detail/${(rowProps.row as (typeof allFailingCheckResults)[number])?.checkId}`)
                  }}
                >
                  <GridRow {...rowProps} />
                </ButtonBase>
              ),
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
              sorting: {
                sortModel: [
                  {
                    field: 'severity',
                    sort: 'desc',
                  },
                  {
                    field: 'number_of_resources_failing',
                    sort: 'desc',
                  },
                ],
              },
            }}
            pagination
            rows={allFailingCheckResults}
          />
        </>
      ) : null}
    </>
  )
}
