import { Trans, t } from '@lingui/macro'
import { ButtonBase, Divider, Stack, Typography } from '@mui/material'
import { DataGridPremium, GridRow, GridToolbar } from '@mui/x-data-grid-premium'
import { useRef } from 'react'
import { InfoFilledIcon, VerifiedUserFilledIcon } from 'src/assets/icons'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { panelUI, sortedSeverities } from 'src/shared/constants'
import { getMessage } from 'src/shared/defined-messages'
import { BenchmarkCheckCollectionNode } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { BenchmarkCheckCollectionNodeWithChildren } from './BenchmarkDetailTreeItem'
import { getAllChildrenCheckResult } from './getAllChildrenCheckResult'

interface BenchmarkCheckCollectionDetailProps {
  id?: string
  bench: BenchmarkCheckCollectionNode
  child: BenchmarkCheckCollectionNodeWithChildren[] | undefined
  onSelect: (checkId: string) => void
  isManual: boolean
}

export const BenchmarkCheckCollectionDetail = ({ id, bench, child, onSelect, isManual }: BenchmarkCheckCollectionDetailProps) => {
  const page = useRef(0)
  const [pageSize, setPageSize] = usePersistState<number>(
    'BenchmarkCheckCollectionDetail.rowsPerPage',
    panelUI.tableRowsPerPages[0],
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  const allChecks = getAllChildrenCheckResult(child)
  const allFailingCheckResults = allChecks.filter((i) => i.number_of_resources_failing)
  const paginationSizeOption = panelUI.tableRowsPerPages.filter((_, i, arr) => allFailingCheckResults.length > (arr[i - 1] ?? 0))

  return (
    <Stack id={id} spacing={1} height={allFailingCheckResults.length ? 'auto' : '100%'}>
      {bench.title ? (
        <Typography variant="h5" component="span">
          {bench.title}
        </Typography>
      ) : (
        <Typography variant="h5" component="span">
          {bench.name}
        </Typography>
      )}
      <Divider flexItem />
      <Typography variant="h6" component="span">
        {bench.description}
      </Typography>
      {/* {bench.documentation ? (
        <>
          <Typography component="div">
            <Trans>Documentation</Trans>:
          </Typography>{' '}
          <Typography variant="h6" component="span">
            {bench.documentation}
          </Typography>
        </>
      ) : undefined} */}
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
            pagination={allFailingCheckResults.length > panelUI.tableRowsPerPages[0]}
            pageSizeOptions={paginationSizeOption}
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
            paginationModel={
              allFailingCheckResults.length > 5
                ? {
                    pageSize: (paginationSizeOption as number[]).includes(pageSize)
                      ? pageSize
                      : pageSize > paginationSizeOption[paginationSizeOption.length - 1]
                        ? pageSize
                        : 5,
                    page: page.current,
                  }
                : undefined
            }
            onPaginationModelChange={(current) => {
              page.current = current.page
              setPageSize(current.pageSize)
            }}
            rows={allFailingCheckResults}
          />
        </>
      ) : isManual ? (
        <Stack flex={1} justifyContent="center" alignItems="center" spacing={1} px={1} pb={2}>
          <InfoFilledIcon width={48} height={48} color="info" />
          <Typography color="info.main" variant="h5" textAlign="center" display="inline-block">
            <Trans>
              This section does not contain any controls that can be automated.
              <br />
              Manual checks or processes are required for compliance.
            </Trans>
          </Typography>
        </Stack>
      ) : (
        <Stack flex={1} justifyContent="center" alignItems="center" spacing={1}>
          <VerifiedUserFilledIcon width={48} height={48} color="success" />
          <Typography color="success.main" variant="h5" textAlign="center">
            <Trans>All resources passed the check</Trans>
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
