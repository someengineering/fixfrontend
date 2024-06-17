import { Trans, t } from '@lingui/macro'
import GppGoodIcon from '@mui/icons-material/GppGood'
import { Box, ButtonBase, Divider, Stack, Typography } from '@mui/material'
import { DataGridPremium, GridRow, GridToolbar } from '@mui/x-data-grid-premium'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { panelUI, sortedSeverities } from 'src/shared/constants'
import { getMessage } from 'src/shared/defined-messages'
import { BenchmarkReportNode } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { BenchmarkCheckCollectionNodeWithChildren } from './BenchmarkDetailTreeItem'
import { getAllChildrenCheckResult } from './getAllChildrenCheckResult'

export interface BenchmarkDetailViewProps {
  id?: string
  benchmarkDetail: BenchmarkReportNode
  child: BenchmarkCheckCollectionNodeWithChildren[] | undefined
  onSelect: (checkId: string) => void
}

export const BenchmarkDetailView = ({ id, benchmarkDetail, child, onSelect }: BenchmarkDetailViewProps) => {
  const allChecks = getAllChildrenCheckResult(child)
  const allFailingCheckResults = allChecks.filter((i) => i.number_of_resources_failing)

  return (
    <Stack id={id} spacing={1} height={allFailingCheckResults.length ? 'auto' : '100%'}>
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
            autoHeight
            pagination={allFailingCheckResults.length > 5}
            pageSizeOptions={[5, ...panelUI.tableRowsPerPages].filter((_, i, arr) => allFailingCheckResults.length > (arr[i - 1] ?? 0))}
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
              row: (rowProps) => {
                const checkId = (rowProps.row as (typeof allFailingCheckResults)[number])?.checkId
                const id = (rowProps.row as (typeof allFailingCheckResults)[number])?.id
                if (id && checkId) {
                  return (
                    <ButtonBase
                      href={`./check-detail/${checkId}`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onSelect(id)
                      }}
                    >
                      <GridRow {...rowProps} />
                    </ButtonBase>
                  )
                }
                return <GridRow {...rowProps} />
              },
            }}
            initialState={{
              pagination:
                allFailingCheckResults.length > 5
                  ? {
                      paginationModel: {
                        pageSize: 5,
                        page: 0,
                      },
                    }
                  : undefined,
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
            rows={allFailingCheckResults}
          />
        </>
      ) : (
        <Stack flex={1} justifyContent="center" alignItems="center" spacing={1}>
          <GppGoodIcon fontSize="large" color="success" sx={{ fontSize: 48 }} />
          <Typography color="success.main" variant="h5" textAlign="center">
            <Trans>All resources passed the check</Trans>
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
