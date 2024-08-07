import { Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { ExternalLink } from 'src/shared/link-button'
import { getWorkspaceCloudAccountsLogsQuery } from './getWorkspaceCloudAccountsLogs.query'

interface WorkspaceSettingsAccountErrorLogProps {
  accountId: string
}

const urlRegex = /(https?:\/\/[^ ]*)/

export const WorkspaceSettingsAccountErrorLog = ({ accountId }: WorkspaceSettingsAccountErrorLogProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryFn: getWorkspaceCloudAccountsLogsQuery,
    queryKey: ['workspace-cloud-accounts-logs', selectedWorkspace?.id, accountId],
  })
  const lines = useMemo(
    () =>
      data.map((line) => {
        const urls = [...(line.match(urlRegex) ?? [])]
        const lineChunks = line.split(urlRegex)
        return lineChunks.map((chunk, i) =>
          urls.includes(chunk) ? (
            <ExternalLink sx={{ wordWrap: 'break-word', wordBreak: 'break-all' }} key={i} href={chunk} />
          ) : (
            <span key={i}>{chunk}</span>
          ),
        )
      }),
    [data],
  )
  return (
    <Typography fontFamily="monospace" component="ul" width="100%" overflow="auto">
      {lines?.map((item, i) => (
        <li key={i}>
          {item}
          <br />
          <br />
        </li>
      ))}
    </Typography>
  )
}
