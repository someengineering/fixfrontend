import { plural, t, Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import GppBadIcon from '@mui/icons-material/GppBad'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import UpdateIcon from '@mui/icons-material/Update'
import { TimelineDot } from '@mui/lab'
import { IconButton, Theme, Typography } from '@mui/material'
import { diffLines } from 'diff'
import { Fragment, MouseEventHandler } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { sortedSeverities } from 'src/shared/constants'
import { getMessage } from 'src/shared/defined-messages'
import {
  WorkspaceInventoryNodeHistory,
  WorkspaceInventoryNodeHistoryDiff,
  WorkspaceInventoryNodeSecurityHistory,
} from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { oneTwoThreeWordedNumber } from 'src/shared/utils/oneTwoThreeWordedNumber'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { stringify } from 'yaml'

export const nodeChangeToStr = (history: WorkspaceInventoryNodeHistory) => {
  switch (history.change) {
    case 'node_created':
      return <Trans>Resource created</Trans>
    case 'node_updated':
      return <Trans>Configuration changed</Trans>
    case 'node_deleted':
      return <Trans>Resource deleted</Trans>
    case 'node_compliant':
    case 'node_vulnerable': {
      const hasCompliances = !!history.diff.node_compliant?.length
      const hasVulnerabilities = !!history.diff.node_vulnerable?.length
      return history.security.has_issues ? (
        hasCompliances && hasVulnerabilities ? (
          <Trans>Security posture changed</Trans>
        ) : hasCompliances ? (
          <Trans>Security posture improved</Trans>
        ) : (
          <Trans>New security issues detected</Trans>
        )
      ) : (
        <Trans>All security issues fixed</Trans>
      )
    }
  }
}

const getNodeSecurityIssueWithNumbers = (diffItem?: WorkspaceInventoryNodeHistoryDiff[]) =>
  diffItem?.length
    ? diffItem?.reduce((prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }), {} as Record<SeverityType, number>)
    : undefined

const getSortedSeverities = (securityIssueWithNumbers: Record<SeverityType, number>) =>
  sortedSeverities
    .map((severity) => (securityIssueWithNumbers[severity] ? { severity, count: securityIssueWithNumbers[severity] } : null))
    .filter((i) => i) as { severity: SeverityType; count: number }[]

const getNodeElement = (securityIssueWithNumbers?: Record<SeverityType, number>, isOneSecurityIssue?: boolean, fixed?: boolean) => {
  if (!securityIssueWithNumbers) {
    return undefined
  }
  const sortedSeverities = getSortedSeverities(securityIssueWithNumbers)
  const lastIndex = sortedSeverities.length - 1

  const numberOfChecks = sortedSeverities.map(({ severity, count }, i) => (
    <Fragment key={`${fixed}_${severity}`}>
      <Typography component="span" color={getColorBySeverity(severity)}>
        {oneTwoThreeWordedNumber(count)} {getMessage(snakeCaseToUFStr(severity))}
      </Typography>
      {i < lastIndex ? ', ' : ''}
    </Fragment>
  ))

  const fixedOrFailedStr = fixed ? t`fixed` : t`failed`

  const checkOrChecksStr = plural(isOneSecurityIssue ? Object.entries(securityIssueWithNumbers)[0][1] : 2, {
    one: 'check',
    other: 'checks',
  })

  const icon = fixed ? (
    <ThumbUpIcon color="success" fontSize="small" sx={{ fontSize: '1rem', mr: 1 }} />
  ) : (
    <ThumbDownIcon color="error" fontSize="small" sx={{ fontSize: '1rem', mr: 1 }} />
  )

  if (isOneSecurityIssue) {
    return (
      <Trans>
        {icon}
        {numberOfChecks[0]} {checkOrChecksStr} {fixedOrFailedStr}.
      </Trans>
    )
  }

  return (
    <Trans>
      {icon}
      Checks {fixedOrFailedStr}: {numberOfChecks}.
    </Trans>
  )
}

const nodeSecurityChangeToElement = (history: WorkspaceInventoryNodeSecurityHistory) => {
  const compliancesFirst = history.change === 'node_compliant'
  const vulnerabilities = getNodeSecurityIssueWithNumbers(history.diff.node_vulnerable)
  const compliances = getNodeSecurityIssueWithNumbers(history.diff.node_compliant)
  const isOneSecurityIssue = Object.keys(vulnerabilities ?? {}).length === 1 || Object.keys(compliances ?? {}).length === 1
  const hasBoth = !!(history.diff.node_vulnerable?.length && history.diff.node_compliant?.length)
  return (
    <Typography width="100%" align="left">
      {compliancesFirst ? getNodeElement(compliances, isOneSecurityIssue, true) : getNodeElement(vulnerabilities, isOneSecurityIssue)}
      {hasBoth ? <br /> : null}
      {compliancesFirst ? getNodeElement(vulnerabilities, isOneSecurityIssue) : getNodeElement(compliances, isOneSecurityIssue, true)}
    </Typography>
  )
}

export const nodeChangeToDescription = (history: WorkspaceInventoryNodeHistory) => {
  const { age: _age, last_update: _lastUpdate, time_created: _timeCreated, ...selectedHistoryReported } = history?.reported ?? {}
  switch (history.change) {
    case 'node_created':
      return null
    case 'node_updated': {
      const { added, removed } = diffLines(stringify(history.before), stringify(selectedHistoryReported)).reduce(
        (prev, part) => ({
          removed: prev.removed + (part.removed ? part.count ?? 0 : 0),
          added: prev.added + (part.added ? part.count ?? 0 : 0),
        }),
        { removed: 0, added: 0 },
      )
      return (
        <Typography width="100%" align="left">
          <Trans>
            {added} configuration lines added and {removed} lines deleted.
          </Trans>
        </Typography>
      )
    }
    case 'node_deleted':
      return null
    case 'node_compliant':
    case 'node_vulnerable':
      return nodeSecurityChangeToElement(history)
  }
}

export const nodeChangeToColorName = (history: WorkspaceInventoryNodeHistory) => {
  switch (history.change) {
    case 'node_created':
      return 'info'
    case 'node_updated':
      return 'primary'
    case 'node_deleted':
      return 'error'
    case 'node_compliant':
    case 'node_vulnerable':
      return history.security.has_issues ? (history.diff.node_compliant?.length ? 'warning' : 'error') : 'success'
  }
}

export const nodeChangeToColor = (history: WorkspaceInventoryNodeHistory, theme?: Theme) => {
  const colorName = nodeChangeToColorName(history)
  return theme?.palette[colorName].main ?? `${colorName}.main`
}

export const nodeChangeToIcon = (history: WorkspaceInventoryNodeHistory, onClick?: MouseEventHandler<HTMLButtonElement>) => {
  switch (history.change) {
    case 'node_created':
      return (
        <TimelineDot color={nodeChangeToColorName(history)} variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              <AddIcon />
            </IconButton>
          ) : (
            <AddIcon />
          )}
        </TimelineDot>
      )
    case 'node_updated':
      return (
        <TimelineDot color={nodeChangeToColorName(history)} variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              <UpdateIcon />
            </IconButton>
          ) : (
            <UpdateIcon />
          )}
        </TimelineDot>
      )
    case 'node_deleted':
      return (
        <TimelineDot color={nodeChangeToColorName(history)} variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              <DeleteIcon />
            </IconButton>
          ) : (
            <DeleteIcon />
          )}
        </TimelineDot>
      )
    case 'node_compliant':
    case 'node_vulnerable': {
      const icon = history.security.has_issues ? history.diff.node_compliant?.length ? <GppMaybeIcon /> : <GppBadIcon /> : <GppGoodIcon />
      return (
        <TimelineDot color={nodeChangeToColorName(history)} variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              {icon}
            </IconButton>
          ) : (
            <GppBadIcon />
          )}
        </TimelineDot>
      )
    }
  }
}
