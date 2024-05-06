import { Button } from '@mui/material'
import { NavigateFunction } from 'react-router-dom'
import { WorkspaceAccountReportSummary, WorkspaceChangedSituation } from 'src/shared/types/server'
import { navigateSubtitleQuery } from './navigateSubtitleQuery'

export const showSubtitleAccount = (
  changedSituation: WorkspaceChangedSituation,
  change: 'node_compliant' | 'node_vulnerable',
  accounts: WorkspaceAccountReportSummary[],
  navigate: NavigateFunction,
) =>
  changedSituation.accounts_selection.map((accountId, i) => {
    const accountName = accounts.find((acc) => accountId === acc.id)?.name
    return (
      <Button
        variant="text"
        size="small"
        sx={{ textTransform: 'initial' }}
        key={`${accountId}_${i}`}
        onClick={() =>
          navigateSubtitleQuery(
            accountName ? `/ancestors.account.reported.name="${accountName}"` : `/ancestors.account.reported.id="${accountId}"`,
            change,
            navigate,
          )
        }
      >
        {accountName ?? accountId}
      </Button>
    )
  })
