import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import GppGoodIcon from '@mui/icons-material/GppGood'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'
import { Button, ButtonBase, Divider, Stack, Typography } from '@mui/material'
import { DataGridPremium, GridRow, GridToolbar } from '@mui/x-data-grid-premium'
import { useParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { panelUI } from 'src/shared/constants'
import { FixQueryParser } from 'src/shared/fix-query-parser'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'

interface BenchmarkDetailCheckDetailProps {
  check: BenchmarkCheckResultNode
  accountName?: string
  id?: string
}

export const BenchmarkDetailCheckDetail = ({ check, accountName, id }: BenchmarkDetailCheckDetailProps) => {
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
    query = `/inventory?q=${window.encodeURIComponent(parser.toString())}`
  }
  return (
    <Stack id={id} spacing={1} height={resources?.length ? 'auto' : '100%'} mb={1}>
      {query ? (
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center" gap={1} width="100%">
          <Typography variant="h5">{check.title ?? check.name}</Typography>
          <Button
            href={query}
            sx={{ ml: 'auto', mr: 0 }}
            startIcon={<SearchIcon />}
            variant="contained"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigate(query)
            }}
          >
            <Trans>Search</Trans>
          </Button>
        </Stack>
      ) : (
        <Typography variant="h5">{check.title ?? check.name}</Typography>
      )}
      <Divider flexItem />
      {check.url ? (
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center" gap={1} width="100%">
          <Typography variant="h5">
            <Trans>Why does it matter</Trans>
          </Typography>
          <Button href={check.url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />} sx={{ ml: 'auto', mr: 0 }}>
            <Trans>More info about check</Trans>
          </Button>
        </Stack>
      ) : (
        <Typography variant="h5">
          <Trans>Why does it matter</Trans>
        </Typography>
      )}
      <Typography>{check.risk}</Typography>
      <Divider flexItem />
      <Typography variant="h5">
        <Trans>How to fix</Trans>
      </Typography>
      <Typography>{check.remediation.text}</Typography>
      {check.remediation.url ? (
        <Stack direction="row" justifyContent="end" width="100%">
          <Button
            href={check.remediation.url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{ ml: 'auto', mr: 0 }}
          >
            <Trans>More info about fix</Trans>
          </Button>
        </Stack>
      ) : null}
      {resources?.length ? (
        <>
          <Divider flexItem />
          <Typography variant="h5">
            <Trans>Affected resources</Trans>
          </Typography>
          <DataGridPremium
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
            autoHeight
            pagination={resources.length > 5}
            pageSizeOptions={[5, ...panelUI.tableRowsPerPages].filter((_, i, arr) => resources.length > (arr[i - 1] ?? 0))}
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
            initialState={{
              pagination:
                resources.length > 5
                  ? {
                      paginationModel: {
                        pageSize: 5,
                        page: 0,
                      },
                    }
                  : undefined,
            }}
            rows={resources}
          />
        </>
      ) : detectType !== 'text' ? (
        <>
          <Divider flexItem />
          <Stack flex={1} justifyContent="center" alignItems="center" spacing={1}>
            <GppGoodIcon fontSize="large" color="success" sx={{ fontSize: 48 }} />
            <Typography color="success.main" variant="h5" textAlign="center">
              <Trans>All resources passed the check</Trans>
            </Typography>
          </Stack>
        </>
      ) : null}
    </Stack>
  )
}
