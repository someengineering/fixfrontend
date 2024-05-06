import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import GppBadIcon from '@mui/icons-material/GppBad'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import UpdateIcon from '@mui/icons-material/Update'
import { TimelineDot } from '@mui/lab'
import { IconButton, Theme, Typography } from '@mui/material'
import { diffLines } from 'diff'
import { MouseEventHandler } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { SeverityType, WorkspaceInventoryNodeHistory } from 'src/shared/types/server'
import { stringify } from 'yaml'

export const nodeChangeToStr = (history: WorkspaceInventoryNodeHistory) => {
  switch (history.change) {
    case 'node_created':
      return <Trans>Resource created</Trans>
    case 'node_updated':
      return <Trans>Configuration changed</Trans>
    case 'node_deleted':
      return <Trans>Resource deleted</Trans>
    case 'node_vulnerable':
      return <Trans>New security issues detected</Trans>
    case 'node_compliant':
      return history.security.has_issues ? <Trans>Security posture improved</Trans> : <Trans>All security issues fixed</Trans>
  }
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
    case 'node_vulnerable': {
      const vulnerabilities = history.diff.node_vulnerable?.reduce(
        (prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }),
        {} as { [key in SeverityType]: number },
      )
      const compliances = history.diff.node_compliant?.reduce(
        (prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }),
        {} as { [key in SeverityType]: number },
      )
      return (
        <Typography width="100%" align="left">
          {history.diff.node_vulnerable?.length ? (
            <>
              <Trans>
                {Object.entries(vulnerabilities ?? {}).map(([severity, count], i) => (
                  <Typography component="span" color={getColorBySeverity(severity)} key={i}>
                    {count} {severity}{' '}
                  </Typography>
                ))}{' '}
                checks failed.
              </Trans>{' '}
            </>
          ) : null}
          {history.diff.node_compliant?.length ? (
            <Trans>
              {Object.entries(compliances ?? {}).map(([severity, count], i) => (
                <Typography component="span" color={getColorBySeverity(severity)} key={i}>
                  {count} {severity}{' '}
                </Typography>
              ))}{' '}
              checks fixed.
            </Trans>
          ) : null}
        </Typography>
      )
    }
    case 'node_compliant': {
      const vulnerabilities = history.diff.node_vulnerable?.reduce(
        (prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }),
        {} as { [key in SeverityType]: number },
      )
      const compliances = history.diff.node_compliant?.reduce(
        (prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }),
        {} as { [key in SeverityType]: number },
      )
      return (
        <Typography width="100%" align="left">
          {history.diff.node_compliant?.length ? (
            <>
              <Trans>
                {Object.entries(compliances ?? {}).map(([severity, count], i) => (
                  <Typography component="span" color={getColorBySeverity(severity)} key={i}>
                    {count} {severity}{' '}
                  </Typography>
                ))}{' '}
                checks fixed.
              </Trans>{' '}
            </>
          ) : null}
          {history.diff.node_vulnerable?.length ? (
            <Trans>
              {Object.entries(vulnerabilities ?? {}).map(([severity, count], i) => (
                <Typography component="span" color={getColorBySeverity(severity)} key={i}>
                  {count} {severity}
                  {'  '}
                </Typography>
              ))}{' '}
              checks failed.
            </Trans>
          ) : null}
        </Typography>
      )
    }
  }
}

export const nodeChangeToColorName = (history: WorkspaceInventoryNodeHistory) => {
  switch (history.change) {
    case 'node_created':
      return 'info' as const
    case 'node_updated':
      return 'primary' as const
    case 'node_deleted':
      return 'error' as const
    case 'node_vulnerable':
      return 'error' as const
    case 'node_compliant':
      return history.security.has_issues ? 'warning' : ('success' as const)
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
    case 'node_vulnerable':
      return (
        <TimelineDot color={nodeChangeToColorName(history)} variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              <GppBadIcon />
            </IconButton>
          ) : (
            <GppBadIcon />
          )}
        </TimelineDot>
      )
    case 'node_compliant': {
      const icon = history.security.has_issues ? <GppMaybeIcon /> : <GppGoodIcon />
      return (
        <TimelineDot color={nodeChangeToColorName(history)} variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              {icon}
            </IconButton>
          ) : (
            icon
          )}
        </TimelineDot>
      )
    }
  }
}
