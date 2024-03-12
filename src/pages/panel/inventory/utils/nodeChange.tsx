import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import UpdateIcon from '@mui/icons-material/Update'
import { TimelineDot } from '@mui/lab'
import { IconButton, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { SeverityType, WorkspaceInventoryNodeHistory, WorkspaceInventoryNodeHistoryChanges } from 'src/shared/types/server'

export const nodeChangeToStr = (nodeChange: WorkspaceInventoryNodeHistoryChanges) => {
  switch (nodeChange) {
    case 'node_created':
      return <Trans>Created</Trans>
    case 'node_updated':
      return <Trans>Updated</Trans>
    case 'node_deleted':
      return <Trans>Deleted</Trans>
    case 'node_vulnerable':
      return <Trans>Found vulnerability</Trans>
    case 'node_compliant':
      return <Trans>Found compliant</Trans>
  }
}

export const nodeChangeToDescription = (history: WorkspaceInventoryNodeHistory, locale?: string) => {
  switch (history.change) {
    case 'node_created':
      return (
        <Typography color="success.main" width="100%" align="left">
          <Trans>Node created at {new Date(history.changed_at).toLocaleTimeString(locale)}</Trans>
        </Typography>
      )
    case 'node_updated':
      return (
        <Typography color="warning.main" width="100%" align="left">
          <Trans>Node updated at {new Date(history.changed_at).toLocaleTimeString(locale)}</Trans>
        </Typography>
      )
    case 'node_deleted':
      return (
        <Typography color="error.main" width="100%" align="left">
          <Trans>Node deleted at {new Date(history.changed_at).toLocaleTimeString(locale)}</Trans>
        </Typography>
      )
    case 'node_vulnerable': {
      const allVulnerabilitiesCount = history.diff.node_vulnerable.length
      const vulnerabilities = history.diff.node_vulnerable.reduce(
        (prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }),
        {} as { [key in SeverityType]: number },
      )
      return allVulnerabilitiesCount ? (
        <Typography width="100%" align="left">
          <Trans>
            Found{' '}
            {Object.entries(vulnerabilities).map(([severity, count], i) => (
              <Typography component="span" color={getColorBySeverity(severity)} key={i}>
                {count} {severity}{' '}
              </Typography>
            ))}{' '}
            vulnerability at {new Date(history.changed_at).toLocaleTimeString(locale)}
          </Trans>
        </Typography>
      ) : null
    }
    case 'node_compliant': {
      const allCompliantCount = history.diff.node_compliant.length
      const compliant = history.diff.node_vulnerable.reduce(
        (prev, cur) => ({ ...prev, [cur.severity]: (prev[cur.severity] ?? 0) + 1 }),
        {} as { [key in SeverityType]: number },
      )
      return allCompliantCount ? (
        <Typography width="100%" align="left">
          <Trans>
            Found resolved{' '}
            {Object.entries(compliant).map(([severity, count], i) => (
              <Typography component="span" color={getColorBySeverity(severity)} key={i}>
                {count} {severity},{' '}
              </Typography>
            ))}{' '}
            vulnerability at {new Date(history.changed_at).toLocaleTimeString(locale)}
          </Trans>
        </Typography>
      ) : null
    }
  }
}

export const nodeChangeToIcon = (nodeChange: WorkspaceInventoryNodeHistoryChanges, onClick?: MouseEventHandler<HTMLButtonElement>) => {
  switch (nodeChange) {
    case 'node_created':
      return (
        <TimelineDot color="primary" variant="outlined">
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
        <TimelineDot color="warning" variant="outlined">
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
        <TimelineDot color="error" variant="outlined">
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
        <TimelineDot color="error" variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              <GppMaybeIcon />
            </IconButton>
          ) : (
            <GppMaybeIcon />
          )}
        </TimelineDot>
      )
    case 'node_compliant':
      return (
        <TimelineDot color="success" variant="outlined">
          {onClick ? (
            <IconButton onClick={onClick} size="small">
              <GppGoodIcon />
            </IconButton>
          ) : (
            <GppGoodIcon />
          )}
        </TimelineDot>
      )
  }
}
