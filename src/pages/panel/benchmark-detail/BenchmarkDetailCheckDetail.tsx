import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import GppGoodIcon from '@mui/icons-material/GppGood'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Button, ButtonBase, Divider, Stack, Typography } from '@mui/material'
import { DataGridPremium, GridRow, GridToolbar } from '@mui/x-data-grid-premium'
import { Link, useParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { FixQueryParser } from 'src/shared/fix-query-parser'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'

interface BenchmarkDetailCheckDetailProps {
  check: BenchmarkCheckResultNode
}

export const BenchmarkDetailCheckDetail = ({ check }: BenchmarkDetailCheckDetailProps) => {
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
      parser = parser.set_cloud_account_region('account', '=', accountId)
    }
    query = parser.toString()
  }
  return (
    <>
      {check.url ? (
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center" gap={1} width="100%">
          <Typography variant="h5">{check.title ?? check.name}</Typography>
          <Button href={check.url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />} sx={{ ml: 'auto', mr: 0 }}>
            <Trans>More info about check</Trans>
          </Button>
        </Stack>
      ) : (
        <Typography variant="h5">{check.title ?? check.name}</Typography>
      )}
      <Divider flexItem />
      <Typography variant="h5">
        <Trans>Why does it matter</Trans>
      </Typography>
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
      <Divider flexItem />
      {resources?.length ? (
        <>
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
                    navigate(`./resource-detail/${(rowProps.row as (typeof resources)[number])?.id}`)
                  }}
                >
                  <GridRow {...rowProps} />
                </ButtonBase>
              ),
            }}
            sx={{ minHeight: 300, minWidth: 100 }}
            disableRowSelectionOnClick
            autoPageSize
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
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            pagination
            rows={resources}
          />
        </>
      ) : (
        <Stack flex={1} justifyContent="center" alignItems="center" spacing={1}>
          <GppGoodIcon fontSize="large" color="success" sx={{ fontSize: 48 }} />
          <Typography color="success.main" variant="h5" textAlign="center">
            <Trans>No resources that are affected by this check</Trans>
          </Typography>
        </Stack>
      )}

      {detectType ? (
        <>
          <Divider flexItem />
          <Typography variant="h5">
            {detectType === 'monospace' ? (
              <>
                <Trans>How we detect</Trans>{' '}
                <Typography component="span" variant="body1" fontWeight={700}>
                  {query ? (
                    <>
                      (
                      <Trans>
                        with search,{' '}
                        <Link
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            navigate(`/inventory?q=${window.encodeURIComponent(query)}`)
                          }}
                          to={`/inventory?q=${window.encodeURIComponent(query)}`}
                        >
                          try it
                        </Link>
                      </Trans>
                      )
                    </>
                  ) : (
                    <Trans>with command line</Trans>
                  )}
                </Typography>
              </>
            ) : (
              <Trans>How you can detect</Trans>
            )}
          </Typography>
          <Typography
            fontFamily={detectType === 'monospace' ? 'monospace' : undefined}
            py={detectType === 'monospace' ? 1 : undefined}
            px={detectType === 'monospace' ? 0.5 : undefined}
            bgcolor={detectType === 'monospace' ? 'common.black' : undefined}
            color={detectType === 'monospace' ? 'common.white' : undefined}
          >
            {query ?? check.detect.fix_cmd ?? check.detect.manual}
          </Typography>
        </>
      ) : null}
    </>
  )
}
