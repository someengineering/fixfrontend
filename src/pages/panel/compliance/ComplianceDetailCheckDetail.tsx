import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button, ButtonBase, Divider, Stack, Typography } from '@mui/material'
import { GridRow, GridToolbar } from '@mui/x-data-grid-premium'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { OpenInNewIcon, SearchIcon, VerifiedUserFilledIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { panelUI } from 'src/shared/constants'
import { FixQueryParser } from 'src/shared/fix-query-parser'
import { StyledDataGrid } from 'src/shared/styled-data-grid'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'
import { usePersistState } from 'src/shared/utils/usePersistState'

interface ComplianceDetailCheckDetailProps {
  check: BenchmarkCheckResultNode
  accountName?: string
  id?: string
}

export const ComplianceDetailCheckDetail = ({ check, accountName, id }: ComplianceDetailCheckDetailProps) => {
  const page = useRef(0)
  const [pageSize, setPageSize] = usePersistState<number>(
    'ComplianceDetailCheckDetail.rowsPerPage',
    panelUI.tableRowsPerPages[0],
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  const {
    i18n: { locale },
  } = useLingui()
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useAbsoluteNavigate()
  const resources = check.resources_failing_by_account
    ? Object.values(check.resources_failing_by_account)
        .flat()
        .map((resource) => ({
          account: resource.account,
          cloud: resource.cloud,
          ctime: resource.ctime ? new Date(resource.ctime) : undefined,
          resourceId: resource.id,
          id: resource.node_id,
          kind: resource.kind,
          name: resource.name,
          region: resource.region,
        }))
    : undefined
  const detectType = check.detect.fix_cmd || check.detect.fix ? 'monospace' : check.detect.manual ? 'text' : undefined
  let query: string | undefined
  if (check.detect.fix) {
    let parser = FixQueryParser.parse(check.detect.fix, check.default_values ?? undefined)
    if (accountId) {
      parser = parser.set_cloud_account_region('account', '=', accountName ?? accountId, true)
    }
    query = `/inventory/search?q=${window.encodeURIComponent(parser.toString())}`
  }
  const paginationSizeOption = resources?.length
    ? panelUI.tableRowsPerPages.filter((_, i, arr) => resources.length > (arr[i - 1] ?? 0))
    : []
  return (
    <Stack id={id} spacing={1} height={resources?.length ? 'auto' : '100%'}>
      {query ? (
        <Stack justifyContent="space-between" flexWrap="wrap" gap={1} width="100%">
          <Button
            href={query}
            sx={{ ml: 'auto', mr: 0 }}
            endIcon={<SearchIcon />}
            variant="contained"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigate(query)
            }}
          >
            <Trans>Inspect Detection Search in Inventory</Trans>
          </Button>
        </Stack>
      ) : null}
      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center" gap={1} width="100%">
        <Typography variant="h6">
          <Trans>Why does it matter</Trans>
        </Typography>
        {check.url ? (
          <Button href={check.url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />} sx={{ ml: 'auto', mr: 0 }}>
            <Trans>Learn more about the associated risk</Trans>
          </Button>
        ) : null}
      </Stack>
      <Typography variant="subtitle1" whiteSpace="pre-wrap" maxWidth={800}>
        {check.risk}
      </Typography>
      <Divider flexItem />
      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center" gap={1} width="100%">
        <Typography variant="h6">
          <Trans>How to fix</Trans>
        </Typography>
        {check.remediation.url ? (
          <Button
            href={check.remediation.url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{ ml: 'auto', mr: 0 }}
          >
            <Trans>Practical remediation guidance</Trans>
          </Button>
        ) : null}
      </Stack>
      <Typography variant="subtitle1" whiteSpace="pre-wrap" maxWidth={800}>
        {check.remediation.text}
      </Typography>
      {resources?.length ? (
        <>
          <Divider flexItem />
          <Typography variant="h6">
            <Trans>Affected resources</Trans>
          </Typography>
          <StyledDataGrid
            slots={{
              toolbar: GridToolbar,
              row: (rowProps) => (
                <ButtonBase
                  href={`./resource-detail/${(rowProps.row as (typeof resources)[number])?.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate({
                      pathname: `./resource-detail/${(rowProps.row as (typeof resources)[number])?.id}`,
                      search: window.location.search,
                    })
                  }}
                >
                  <GridRow {...rowProps} />
                </ButtonBase>
              ),
            }}
            sx={{ minHeight: 300, minWidth: 100 }}
            disableRowSelectionOnClick
            pagination={resources.length > panelUI.tableRowsPerPages[0]}
            pageSizeOptions={paginationSizeOption}
            columns={[
              {
                field: 'cloud',
                headerName: t`Cloud`,
                renderCell: ({ value }) => (value ? <CloudAvatar cloud={value as string} /> : null),
                display: 'flex',
              },
              {
                field: 'resourceId',
                headerName: t`Id`,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'name',
                headerName: t`Name`,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'region',
                headerName: t`Region`,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'kind',
                headerName: t`Kind`,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'account',
                headerName: t`Account`,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'ctime',
                headerName: t`Creation Date`,
                type: 'dateTime',
                valueFormatter: (value: Date) => `${value.toLocaleDateString(locale)} ${value.toLocaleTimeString(locale)}`,
                width: 200,
                minWidth: 100,
              },
            ]}
            paginationModel={
              resources.length > 5
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
            rows={resources}
          />
        </>
      ) : detectType !== 'text' ? (
        <>
          <Divider flexItem />
          <Stack flex={1} justifyContent="center" alignItems="center" spacing={1} pb={2}>
            <VerifiedUserFilledIcon width={48} height={48} color="success" />
            <Typography color="success.main" variant="h6" textAlign="center">
              <Trans>All resources passed the check</Trans>
            </Typography>
          </Stack>
        </>
      ) : null}
    </Stack>
  )
}
