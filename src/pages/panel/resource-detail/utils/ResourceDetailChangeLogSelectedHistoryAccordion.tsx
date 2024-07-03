import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Accordion, AccordionDetails, Box, Chip, Grid, Stack, Typography, accordionSummaryClasses } from '@mui/material'
import { useEffect, useState } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { getMessage } from 'src/shared/defined-messages'
import { StickyAccordionSummaryWithIcon } from 'src/shared/sticky-accordion-summary'
import { WorkspaceInventoryNodeHistoryDiff } from 'src/shared/types/server'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

interface ResourceDetailChangeLogSelectedHistoryAccordionProps {
  data: WorkspaceInventoryNodeHistoryDiff
  benchmarks?: string[]
  title?: string
  isVulnerable?: boolean
}

export const ResourceDetailChangeLogSelectedHistoryAccordion = ({
  data,
  benchmarks,
  title,
  isVulnerable,
}: ResourceDetailChangeLogSelectedHistoryAccordionProps) => {
  const [expanded, setExpanded] = useState(true)
  const {
    i18n: { locale },
  } = useLingui()
  useEffect(() => {
    setExpanded(false)
  }, [])
  return (
    <Accordion expanded={expanded} onChange={(_, expanded) => setExpanded(expanded)}>
      <StickyAccordionSummaryWithIcon
        offset={-2}
        sx={{ height: '100%', [`.${accordionSummaryClasses.content}`]: { width: '100%', overflow: 'hidden' } }}
      >
        <Grid container spacing={2} display="flex" justifyContent="space-between" flexDirection="row" width="100%">
          <Grid item sx={{ overflowX: 'auto', overflowY: 'hidden' }} flexShrink={1} alignSelf="start">
            <Typography variant="h6" color={isVulnerable ? 'error.main' : 'success.main'} flexShrink={1}>
              {title ?? data.check}
            </Typography>
          </Grid>
          <Grid item alignSelf="center" flexGrow={1}>
            <Stack direction="row" display="flex" justifyContent="end" alignItems="center">
              <Typography color={getColorBySeverity(data.severity)}>{getMessage(snakeCaseToUFStr(data.severity))}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </StickyAccordionSummaryWithIcon>
      <AccordionDetails>
        <Stack spacing={1}>
          <Box>
            <Typography width={150} component="span">
              <Trans>Benchmarks</Trans>:
            </Typography>
            <Stack gap={1} direction="row" flexWrap="wrap" alignItems="start" mt={1}>
              {(benchmarks ?? data.benchmarks).map((benchmark, i) => (
                <Chip label={benchmark} key={benchmark + i} color="primary" />
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography width={150} component="span" mr={1}>
              <Trans>Opened at</Trans>:
            </Typography>
            <Typography color="primary.main" component="span">
              {new Date(data.opened_at).toLocaleDateString(locale)} {new Date(data.opened_at).toLocaleTimeString(locale)}
            </Typography>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
