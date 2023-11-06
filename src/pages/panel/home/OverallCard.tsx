import { Trans } from '@lingui/macro'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ErrorIcon from '@mui/icons-material/Error'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { Divider, Grid, Stack, SvgIcon, Typography } from '@mui/material'
import { CircularScore } from 'src/shared/circular-score'
import { colorFromRedToGreen } from 'src/shared/constants'
import { OverviewCard } from 'src/shared/overview-card'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { iso8601DurationToString, parseISO8601Duration } from 'src/shared/utils/parseISO8601Duration'
import { checkDiff, showSubtitle } from './utils'

export const OverallCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  if (!data) {
    return null
  }
  const difference = checkDiff(data)
  const hasDifference = Boolean(difference && !Number.isNaN(difference))
  const positive = difference >= 0
  const overallColor = hasDifference ? colorFromRedToGreen[data.overall_score] : 'info'
  const since = data?.changed_vulnerable.since ? iso8601DurationToString(parseISO8601Duration(data?.changed_vulnerable.since)) : null
  const changedCompliantArray = Object.values(data.changed_compliant.resource_count_by_severity)
  const hasChangedCompliant = changedCompliantArray.length
  const changedVulnerableArray = Object.values(data.changed_vulnerable.resource_count_by_severity)
  const hasChangedVulnerable = changedVulnerableArray.length
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
        <OverviewCard
          height={180}
          title={<Trans>Overall Score</Trans>}
          value={<CircularScore score={data.overall_score} />}
          iconBackgroundColor={colorFromRedToGreen[data.overall_score]}
          icon={<AssessmentIcon />}
          bottomContent={
            <>
              <Stack alignItems="center" direction="row" spacing={0.5}>
                {hasDifference ? (
                  <SvgIcon sx={{ color: overallColor }} fontSize="small">
                    {positive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </SvgIcon>
                ) : null}
                <Typography color={overallColor} variant="body2">
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
      {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
        <OverviewCard
          height={180}
          title={<Trans>Failed Checks</Trans>}
          value={
            <Trans>
              {data.check_summary.failed_checks} out of {data.check_summary.available_checks}
            </Trans>
          }
          iconBackgroundColor="error.main"
          icon={<ReportProblemIcon />}
          bottomContent={
            <Stack direction="row" alignItems="center" spacing={1} width="100%" height={20}>
              {showSubtitle(data.check_summary.failed_checks_by_severity)}
            </Stack>
          }
        />
      </Grid> */}
      <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
        <OverviewCard
          alwaysShowExpandable
          minHeight={180}
          title={<Trans>Improved</Trans>}
          value={
            hasChangedCompliant ? (
              <Stack alignItems="center" direction="row" spacing={1} height={24}>
                <Typography variant="h4">{changedCompliantArray.reduce((a, b) => a + b, 0)}</Typography>
                <Typography variant="caption">{since ? <Trans>Since {since}</Trans> : null}</Typography>
              </Stack>
            ) : (
              <Stack alignItems="center" direction="row" spacing={1} height="100%" mt={2}>
                <Stack>
                  <Typography variant="subtitle2">
                    <Trans>Nothing to show yet</Trans>
                  </Typography>
                  <Typography variant="subtitle2">
                    <Trans>Pick one of the recommendations to the right and improve your security</Trans>
                  </Typography>
                </Stack>
              </Stack>
            )
          }
          iconBackgroundColor="success.main"
          icon={<InsertEmoticonIcon />}
          bottomContent={
            hasChangedCompliant ? (
              <Stack direction="row" alignItems="center" spacing={1} width="100%" height={20}>
                {showSubtitle(data.changed_compliant.resource_count_by_severity)}
              </Stack>
            ) : null
          }
          expandableContent={
            data.changed_compliant.accounts_selection.length ? (
              <Stack spacing={0.5}>
                <Divider />
                <Typography variant="overline">
                  <Trans>Most Improved Accounts</Trans>
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
                  <Trans>Most Improved Resources</Trans>
                </Typography>
                {Object.entries(data.changed_compliant.resource_count_by_kind_selection).map(([key, value]) => (
                  <Typography variant="body2" key={key}>
                    {key}: {value}
                  </Typography>
                ))}
              </Stack>
            ) : null
          }
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
        <OverviewCard
          minHeight={180}
          alwaysShowExpandable
          title={<Trans>Compliance</Trans>}
          value={
            hasChangedVulnerable ? (
              <Stack alignItems="center" direction="row" spacing={1} height={24}>
                <Typography variant="h4">{changedVulnerableArray.reduce((a, b) => a + b, 0)}</Typography>
                <Typography variant="caption">{since ? <Trans>Since {since}</Trans> : null}</Typography>
              </Stack>
            ) : (
              <Stack alignItems="center" direction="row" spacing={1} height="100%" mt={2}>
                <Stack>
                  <Typography variant="subtitle2">
                    <Trans>Nothing to show yet</Trans>
                  </Typography>
                </Stack>
              </Stack>
            )
          }
          iconBackgroundColor="error.main"
          icon={<ErrorIcon />}
          bottomContent={
            hasChangedVulnerable ? (
              <Stack direction="row" alignItems="center" spacing={1} width="100%" height={20}>
                {showSubtitle(data.changed_vulnerable.resource_count_by_severity)}
              </Stack>
            ) : null
          }
          expandableContent={
            data.changed_vulnerable.accounts_selection.length ||
            Object.entries(data.changed_vulnerable.resource_count_by_kind_selection).length ? (
              <Stack spacing={0.5}>
                {data.changed_vulnerable.accounts_selection.length ? (
                  <>
                    <Divider />
                    <Typography variant="overline">
                      <Trans>Top Non-Compliant Accounts</Trans>
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
                      <Trans>Top Non-Compliant Resources</Trans>
                    </Typography>
                    {Object.entries(data.changed_vulnerable.resource_count_by_kind_selection).map(([key, value]) => (
                      <Typography variant="body2" key={key}>
                        {key}: {value}
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
