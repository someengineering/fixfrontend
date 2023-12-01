import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, Stack, Typography } from '@mui/material'
import { NavigateFunction } from 'react-router-dom'
import { createInventorySearchTo, getColorBySeverity } from 'src/pages/panel/shared/utils'
import { getMessage } from 'src/shared/defined-messages'
import { FailedCheck } from 'src/shared/types/server'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

interface FailedChecks {
  failedCheck: FailedCheck
  navigate?: NavigateFunction
  smallText?: boolean
}

export const FailedChecks = ({ failedCheck, navigate, smallText }: FailedChecks) => {
  return (
    <Grid item xs={12} flexDirection="column">
      <Accordion>
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
        <AccordionDetails>
          <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined}>
            <Trans>Risk</Trans>
          </Typography>
          <Typography>{failedCheck.risk}</Typography>
          <Typography variant={smallText ? 'h6' : 'h5'} fontWeight={smallText ? 800 : undefined} mt={2}>
            <Trans>How to fix</Trans>
          </Typography>
          <Typography>{failedCheck.remediation.text}</Typography>
        </AccordionDetails>
        <AccordionActions>
          <Stack spacing={1} direction="row">
            {navigate && (
              <Button
                onClick={() =>
                  navigate(createInventorySearchTo(`/security.has_issues=true and /security.issues[*].check="${failedCheck.id}"`))
                }
                variant="outlined"
              >
                <Trans>Go to resources</Trans>
              </Button>
            )}
            <Button href={failedCheck.remediation.url} target="_blank" endIcon={<OpenInNewIcon />}>
              <Trans>More info</Trans>
            </Button>
          </Stack>
        </AccordionActions>
      </Accordion>
    </Grid>
  )
}