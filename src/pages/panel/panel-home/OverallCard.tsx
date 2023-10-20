import { Trans } from '@lingui/macro'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ErrorIcon from '@mui/icons-material/Error'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { Divider, Grid, Stack, SvgIcon, Typography } from '@mui/material'
import { sortedSeverities } from 'src/shared/constants'
import { OverviewCard } from 'src/shared/overview-card'
import { FailedChecksType, GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { iso8601DurationToString, parseISO8601Duration } from 'src/shared/utils/parseISO8601Duration'
import { snakeCaseToUFStr, snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { getColorByScore, getColorBySeverity } from './getColor'

const checkDiff = (data: GetWorkspaceInventoryReportSummaryResponse) => {
  const compliant = data.changed_compliant.resource_count_by_severity
  const vulnerable = data.changed_vulnerable.resource_count_by_severity
  return Math.round(
    ((compliant.critical ?? 0) * 4 +
      (compliant.high ?? 0) * 3 +
      (compliant.medium ?? 0) * 2 +
      (compliant.low ?? 0) -
      (vulnerable.critical ?? 0) * 4 -
      (vulnerable.high ?? 0) * 3 -
      (vulnerable.medium ?? 0) * 2 -
      (vulnerable.low ?? 0)) /
      (data.check_summary.available_checks * 4),
  )
}

const showSubtitle = (data: Partial<FailedChecksType<number>>) => (
  <Stack direction="row" alignItems="center" spacing={1} width="100%" height={20}>
    {sortedSeverities
      .filter((key) => data[key])
      .map((key) => (
        <Stack key={key} direction="row">
          <Typography color={`${getColorBySeverity(key)}.main`} variant="body2">
            {snakeCaseToUFStr(key)}
          </Typography>
          <Typography variant="body2">: {data[key]}</Typography>
        </Stack>
      ))}
  </Stack>
)

export const OverallCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  if (!data) {
    return null
  }
  const difference = checkDiff(data)
  const hasDifference = Boolean(difference && !Number.isNaN(difference))
  const positive = difference >= 0
  const overallColor = hasDifference ? getColorByScore(data.overall_score) : 'info'
  const since = data?.changed_vulnerable.since ? iso8601DurationToString(parseISO8601Duration(data?.changed_vulnerable.since)) : null
  return (
    <Grid container spacing={2} my={2}>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
        <OverviewCard
          title={<Trans>Overall Score</Trans>}
          value={<>{data.overall_score}</>}
          iconBackgroundColor={`${overallColor}.main`}
          icon={<AssessmentIcon />}
          bottomContent={
            <>
              <Stack alignItems="center" direction="row" spacing={0.5}>
                {hasDifference ? (
                  <SvgIcon color={overallColor} fontSize="small">
                    {positive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </SvgIcon>
                ) : null}
                <Typography color={`${overallColor}.main`} variant="body2">
                  {hasDifference ? difference : <Trans>No changes</Trans>}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                {since ? <Trans>Since {since}</Trans> : null}
              </Typography>
            </>
          }
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
        <OverviewCard
          title={<Trans>Failed Checks</Trans>}
          value={
            <Trans>
              {data.check_summary.failed_checks} out of {data.check_summary.available_checks}
            </Trans>
          }
          iconBackgroundColor="error.main"
          icon={<ReportProblemIcon />}
          bottomContent={showSubtitle(data.check_summary.failed_checks_by_severity)}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
        <OverviewCard
          title={<Trans>Improved</Trans>}
          value={
            Object.values(data.changed_compliant.resource_count_by_severity).length ? (
              <Stack alignItems="center" direction="row" spacing={1} height={24}>
                <Typography variant="h4">
                  {Object.values(data.changed_compliant.resource_count_by_severity).reduce((a, b) => a + b, 0)}
                </Typography>
                <Typography variant="caption">{since ? <Trans>Since {since}</Trans> : null}</Typography>
              </Stack>
            ) : (
              <Stack alignItems="center" direction="row" spacing={1} height={24}>
                <Typography variant="caption">Nothing to show here</Typography>
              </Stack>
            )
          }
          iconBackgroundColor="success.main"
          icon={<InsertEmoticonIcon />}
          bottomContent={showSubtitle(data.changed_compliant.resource_count_by_severity)}
          expandableContent={
            data.changed_compliant.accounts_selection.length ? (
              <Stack spacing={0.5}>
                <Divider />
                <Typography variant="overline">
                  <Trans>Top Improved Accounts</Trans>
                </Typography>
                {data.changed_compliant.accounts_selection.map((accountId) => {
                  const account = data.accounts.find((acc) => accountId === acc.id)
                  return (
                    <Typography variant="body2" key={accountId}>
                      {account?.name ?? accountId}
                    </Typography>
                  )
                })}
                <Divider />
                <Typography variant="overline">
                  <Trans>Top Improved Resources</Trans>
                </Typography>
                {Object.entries(data.changed_compliant.resource_count_by_kind_selection).map(([key, value]) => (
                  <Typography variant="body2" key={key}>
                    {snakeCaseWordsToUFStr(key)}: {value}
                  </Typography>
                ))}
              </Stack>
            ) : null
          }
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
        <OverviewCard
          title={<Trans>Infected</Trans>}
          value={
            Object.values(data.changed_vulnerable.resource_count_by_severity).length ? (
              <Stack alignItems="center" direction="row" spacing={1} height={24}>
                <Typography variant="h4">
                  {Object.values(data.changed_vulnerable.resource_count_by_severity).reduce((a, b) => a + b, 0)}
                </Typography>
                <Typography variant="caption">{since ? <Trans>Since {since}</Trans> : null}</Typography>
              </Stack>
            ) : (
              <Stack alignItems="center" direction="row" spacing={1} height={24}>
                <Typography variant="caption">Nothing to show here</Typography>
              </Stack>
            )
          }
          iconBackgroundColor="error.main"
          icon={<ErrorIcon />}
          bottomContent={showSubtitle(data.changed_vulnerable.resource_count_by_severity)}
          expandableContent={
            data.changed_vulnerable.accounts_selection.length ||
            Object.entries(data.changed_vulnerable.resource_count_by_kind_selection).length ? (
              <Stack spacing={0.5}>
                {data.changed_vulnerable.accounts_selection.length ? (
                  <>
                    <Divider />
                    <Typography variant="overline">
                      <Trans>Top Infected Accounts</Trans>
                    </Typography>
                    {data.changed_vulnerable.accounts_selection.map((accountId) => {
                      const account = data.accounts.find((acc) => accountId === acc.id)
                      return (
                        <Typography variant="body2" key={accountId}>
                          {account?.name ?? accountId}
                        </Typography>
                      )
                    })}
                  </>
                ) : null}
                {Object.entries(data.changed_vulnerable.resource_count_by_kind_selection).length ? (
                  <>
                    <Divider />
                    <Typography variant="overline">
                      <Trans>Top Infected Resources</Trans>
                    </Typography>
                    {Object.entries(data.changed_vulnerable.resource_count_by_kind_selection).map(([key, value]) => (
                      <Typography variant="body2" key={key}>
                        {snakeCaseWordsToUFStr(key)}: {value}
                      </Typography>
                    ))}
                  </>
                ) : null}
              </Stack>
            ) : null
          }
        />
      </Grid>
    </Grid>
  )
}
