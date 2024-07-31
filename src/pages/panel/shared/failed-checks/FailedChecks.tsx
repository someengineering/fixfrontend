import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { MouseEvent, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { createInventorySearchTo, getColorBySeverity } from 'src/pages/panel/shared/utils'
import { NavigateFunction } from 'src/shared/absolute-navigate'
import { getMessage } from 'src/shared/defined-messages'
import { FailedCheck } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { FailedCheckIgnoreButton } from './FailedCheckIgnoreButton'

interface FailedChecks {
  failedCheck: FailedCheck
  navigate?: NavigateFunction
  smallText?: boolean
  withResources?: boolean
  ignoreProps?: {
    currentIgnoreSecurityIssue: string
    onToggle: (currentIgnoreSecurityIssue: string, ignore: boolean) => void
    pending: boolean
  }
  ignored?: boolean
  benchmarks?: string[]
  to?: string | (() => string)
}

export const FailedChecks = ({ failedCheck, navigate, smallText, withResources, benchmarks, ignored, ignoreProps }: FailedChecks) => {
  const [expanded, setExpanded] = useState(false)
  const { selectedWorkspace } = useUserProfile()
  const query = `/security.has_issues=true and /security.issues[*].check="${failedCheck.id}"`
  const { data, isLoading } = useQuery({
    queryFn: postWorkspaceInventorySearchTableQuery,
    queryKey: ['workspace-inventory-search-table', selectedWorkspace?.id ?? '', query, 0, 5, false, '', ''],
    enabled: !!(withResources === true && selectedWorkspace?.id && expanded && query),
  })
  const [[_, ...resources]] = data ?? [[]]
  const to = createInventorySearchTo(query) as { pathname: string; search: string }
  const href = `${to.pathname}${to.search}`
  return (
    <Grid
      item
      xs={12}
      flexDirection="column"
      pt={ignored ? 2 : 0}
      sx={ignored ? { opacity: 0.3, transition: ({ transitions }) => transitions.create('opacity'), '&:hover': { opacity: 1 } } : undefined}
    >
      <Accordion
        expanded={withResources ? expanded : undefined}
        onChange={withResources ? (_, expanded) => setExpanded(expanded) : undefined}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ height: '100%' }}>
          <Grid container spacing={2} display="flex" justifyContent="space-between" flexDirection="row" width="100%">
            <Grid item>
              <Typography variant={smallText ? 'h6' : 'h5'}>{failedCheck.title}</Typography>
            </Grid>
            <Grid item alignSelf="center" flex={1}>
              <Stack spacing={2} direction="row" display="flex" justifyContent="end" alignItems="center">
                <Typography color={getColorBySeverity(failedCheck.severity)}>{failedCheck.service.toUpperCase()}</Typography>
                <Typography color={getColorBySeverity(failedCheck.severity)}>
                  {getMessage(snakeCaseToUFStr(failedCheck.severity))}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          {ignored ? (
            <Box position="absolute" left={2} top={-14}>
              <Chip variant="outlined" color="error" label={<Trans>Ignored</Trans>} size="small" />
            </Box>
          ) : null}
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          {ignored ? (
            <Alert color="warning">
              <AlertTitle>
                <Trans>Delayed Effect</Trans>:
              </AlertTitle>
              <Trans>You've chosen to ignore this security check for the resource. Please note:</Trans>
              <br />
              <Trans>
                The change will be active from the next security scan onwards. Until the next scan, the resource will still show the failing
                check.
              </Trans>
            </Alert>
          ) : null}
          <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
            <Trans>Risk</Trans>
          </Typography>
          <Typography>{failedCheck.risk}</Typography>
          <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
            <Trans>How to fix</Trans>
          </Typography>
          <Typography>{failedCheck.remediation.text}</Typography>
          {withResources ? (
            <>
              <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
                <Trans>Top Non-Compliant Resources</Trans>
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
                {resources.length
                  ? resources.map((resource) => {
                      const to = createInventorySearchTo(query) as { pathname: string; search: string }
                      if (typeof to === 'object') {
                        to.pathname += `/resource-detail/${resource.id}`
                        to.search += `&name=${resource.row.name}`
                      }
                      const href = `${to.pathname}${to.search}`
                      return (
                        <Chip
                          key={resource.id}
                          label={`${resource.row.name} ${resource.row.account ? `(${resource.row.account})` : ''}`}
                          variant="outlined"
                          color="info"
                          {...(navigate
                            ? {
                                component: 'a',
                                href,
                                onClick: (e: MouseEvent) => {
                                  e.preventDefault()
                                  navigate(href)
                                },
                              }
                            : {})}
                        />
                      )
                    })
                  : isLoading
                    ? new Array(5)
                        .fill('')
                        .map((_, i) => <Skeleton key={i} variant="rounded" sx={{ borderRadius: 4 }} width={100} height={32} />)
                    : null}
              </Stack>
            </>
          ) : null}
          {failedCheck.resources_failing_by_account ? (
            <>
              <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
                <Trans>Non-Compliant Resources</Trans>
              </Typography>
              {Object.entries(failedCheck.resources_failing_by_account).map(([accountId, resources]) => (
                <Accordion key={accountId}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="manual-setup-content" id="manual-setup-header">
                    <Typography variant="h5">
                      {resources.find((resource) => typeof resource.account === 'string')?.account ?? accountId}
                    </Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails>
                    <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
                      {resources.map((resource) => {
                        const href = `${window.location.pathname}/resource-detail/${resource.node_id}${window.location.search === '?' ? '' : window.location.search ? `${window.location.search}&` : '?'}${resource.name ? `name=${resource.name}` : ''}${resource.cloud ? `&cloud=${resource.cloud}` : ''}`
                        return (
                          <Chip
                            key={resource.node_id ?? resource.id}
                            label={`${resource.name} ${resource.account && typeof resource.account === 'string' ? `(${resource.account})` : ''}`}
                            variant="outlined"
                            color="info"
                            {...(navigate && resource.node_id
                              ? {
                                  component: 'a',
                                  href,
                                  onClick: (e: MouseEvent) => {
                                    e.preventDefault()
                                    navigate(href)
                                  },
                                }
                              : {})}
                          />
                        )
                      })}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          ) : null}
          {failedCheck.benchmarks?.length || benchmarks?.length ? (
            <>
              <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
                <Trans>Failing benchmarks</Trans>
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
                {(failedCheck.benchmarks || benchmarks)?.map((benchmark, i) => (
                  <Chip
                    label={typeof benchmark === 'string' ? benchmark : benchmark.title || benchmark.id}
                    key={i}
                    variant="outlined"
                    color="info"
                  />
                ))}
              </Stack>
            </>
          ) : null}
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Stack spacing={1} direction="row">
            {ignoreProps ? (
              ignored || ignoreProps.pending ? (
                <FailedCheckIgnoreButton ignored={ignored} {...ignoreProps} />
              ) : (
                <Tooltip
                  title={
                    <Alert severity="warning">
                      <AlertTitle>
                        <Trans>If this security check does not apply to this resource, you can safely ignore it.</Trans>
                      </AlertTitle>
                    </Alert>
                  }
                  slotProps={{ tooltip: { sx: { p: 0 } } }}
                  arrow
                >
                  <FailedCheckIgnoreButton ignored={ignored} {...ignoreProps} />
                </Tooltip>
              )
            ) : null}

            {navigate && (
              <Button
                href={href}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(href)
                }}
                variant="outlined"
              >
                <Trans>Show resources</Trans>
              </Button>
            )}
            <Button href={failedCheck.remediation.url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />}>
              <Trans>More info</Trans>
            </Button>
          </Stack>
        </AccordionActions>
      </Accordion>
    </Grid>
  )
}
