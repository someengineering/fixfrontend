import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { createInventorySearchTo, getColorBySeverity } from 'src/pages/panel/shared/utils'
import { getMessage } from 'src/shared/defined-messages'
import { FailedCheck } from 'src/shared/types/server'
import { snakeCaseToUFStr, snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

interface FailedChecks {
  failedCheck: FailedCheck
  navigate?: NavigateFunction
  smallText?: boolean
  withResources?: boolean
  benchmarks?: string[]
}

export const FailedChecks = ({ failedCheck, navigate, smallText, withResources, benchmarks }: FailedChecks) => {
  const [expanded, setExpanded] = useState(false)
  const { selectedWorkspace } = useUserProfile()
  const query = `/security.has_issues=true and /security.issues[*].check="${failedCheck.id}"`
  const { data, isLoading } = useQuery({
    queryFn: postWorkspaceInventorySearchTableQuery,
    queryKey: ['workspace-inventory-search-table', selectedWorkspace?.id ?? '', query, 0, 5, false, '', ''],
    enabled: !!(withResources && selectedWorkspace?.id && expanded && query),
  })
  const [[_, ...resources]] = data ?? [[]]
  return (
    <Grid item xs={12} flexDirection="column">
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
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined}>
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
                  ? resources.map((resource) => (
                      <Chip
                        label={`${resource.row.name} ${resource.row.account ? `(${resource.row.account})` : ''}`}
                        variant="outlined"
                        color="info"
                        onClick={
                          navigate
                            ? () => {
                                const to = createInventorySearchTo(query)
                                if (typeof to === 'object') {
                                  to.pathname += `/resource-detail/${resource.id}`
                                  to.search += `&name=${resource.row.name}`
                                }
                                navigate(to)
                              }
                            : undefined
                        }
                      />
                    ))
                  : isLoading
                    ? new Array(5).fill('').map(() => <Skeleton variant="rounded" sx={{ borderRadius: 4 }} width={100} height={32} />)
                    : null}
              </Stack>
            </>
          ) : null}
          {benchmarks && benchmarks.length ? (
            <>
              <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
                <Trans>Failing benchmarks</Trans>
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
                {benchmarks.map((benchmark) => (
                  <Chip label={snakeCaseWordsToUFStr(benchmark)} variant="outlined" color="info" />
                ))}
              </Stack>
            </>
          ) : null}
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Stack spacing={1} direction="row">
            {navigate && (
              <Button onClick={() => navigate(createInventorySearchTo(query))} variant="outlined">
                <Trans>Go to resources</Trans>
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
