import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, Stack, Typography } from '@mui/material'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { getMessage } from 'src/shared/defined-messages'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

export const TopFiveChecksCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  return data ? (
    <Grid container spacing={2} my={{ xs: 2, md: 0 }}>
      {data.top_checks.map((topCheck, i) => (
        <Grid item xs={12} key={i} flexDirection="column">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ height: '100%' }}>
              <Grid container spacing={2} display="flex" justifyContent="space-between" flexDirection="row" width="100%">
                <Grid item>
                  <Typography variant="h5">{topCheck.title}</Typography>
                </Grid>
                <Grid item alignSelf="center" flex={1}>
                  <Stack spacing={2} direction="row" display="flex" justifyContent="end" alignItems="center">
                    <Typography color={getColorBySeverity(topCheck.severity)}>{topCheck.service.toUpperCase()}</Typography>
                    <Typography color={getColorBySeverity(topCheck.severity)}>{getMessage(snakeCaseToUFStr(topCheck.severity))}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h5">
                <Trans>Risk</Trans>
              </Typography>
              <Typography>{topCheck.risk}</Typography>
              <Typography variant="h5" mt={2}>
                <Trans>How to fix</Trans>
              </Typography>
              <Typography>{topCheck.remediation.text}</Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button href={topCheck.remediation.url} target="_blank" endIcon={<OpenInNewIcon />}>
                <Trans>More info</Trans>
              </Button>
            </AccordionActions>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  ) : null
}
