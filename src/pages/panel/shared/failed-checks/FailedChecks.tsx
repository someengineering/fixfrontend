import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import WarningIcon from '@mui/icons-material/Warning'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
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
import { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { createInventorySearchTo, getColorBySeverity } from 'src/pages/panel/shared/utils'
import { getMessage } from 'src/shared/defined-messages'
import { FailedCheck } from 'src/shared/types/server'
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
}

export const FailedChecks = ({ failedCheck, navigate, smallText, withResources, benchmarks, ignored, ignoreProps }: FailedChecks) => {
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
              <Trans>Delayed Effect</Trans>:<br />
              <Typography variant="h6">
                <Trans>You've chosen to ignore this security check for the resource. Please note:</Trans>
                <br />
                <Trans>
                  The change will be active from the next security scan onwards. Until the next scan, the resource will still show the
                  failing check.
                </Trans>
              </Typography>
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
                  ? resources.map((resource) => (
                      <Chip
                        key={resource.id}
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
                    ? new Array(5)
                        .fill('')
                        .map((_, i) => <Skeleton key={i} variant="rounded" sx={{ borderRadius: 4 }} width={100} height={32} />)
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
                {benchmarks.map((benchmark, i) => (
                  <Chip label={benchmark} key={i} variant="outlined" color="info" />
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WarningIcon color="warning" />
                      <Typography color="warning.main">
                        <Trans>If this security check does not apply to this resource, you can safely ignore it.</Trans>
                      </Typography>
                    </Stack>
                  }
                >
                  <FailedCheckIgnoreButton ignored={ignored} {...ignoreProps} />
                </Tooltip>
              )
            ) : null}
            {navigate && (
              <Button onClick={() => navigate(createInventorySearchTo(query))} variant="outlined">
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
