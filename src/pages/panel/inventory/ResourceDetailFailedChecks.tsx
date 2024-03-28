import { Trans } from '@lingui/macro'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, Divider, Paper, Stack } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment } from 'react'
import { useUserProfile } from 'src/core/auth'
import { FailedCheckIgnoreButton, FailedChecks } from 'src/pages/panel/shared/failed-checks'
import { patchWorkspaceInventoryNodeSecurityIgnoreQuery } from 'src/pages/panel/shared/queries'
import { FailedCheck, NodeSecurity, WorkspaceInventoryNode } from 'src/shared/types/server'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { ResourceDetailAccordionSummary } from './ResourceDetail'
import { ResourceDetailFailedCheckIgnoredChecks } from './ResourceDetailFailedCheckIgnoredChecks'

interface ResourceDetailFailedChecksProps {
  failingChecks: FailedCheck[]
  resourceDetailId: string
  securityIgnore: null | '*' | string[]
  securityIgnoreTitles?: string[]
  nodeSecurityIssues: NodeSecurity['issues']
}

export const ResourceDetailFailedChecks = ({
  failingChecks,
  securityIgnore,
  securityIgnoreTitles,
  nodeSecurityIssues,
  resourceDetailId,
}: ResourceDetailFailedChecksProps) => {
  const queryClient = useQueryClient()
  const { selectedWorkspace } = useUserProfile()
  const { mutate: ignoreNode, isPending } = useMutation({
    mutationFn: patchWorkspaceInventoryNodeSecurityIgnoreQuery,
    onSuccess: (data) => {
      queryClient.setQueryData(['workspace-inventory-node', selectedWorkspace?.id, resourceDetailId], (oldData: WorkspaceInventoryNode) => {
        return { ...oldData, resource: data } as WorkspaceInventoryNode
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-inventory-node',
      })
    },
  })
  const handleToggle = (currentIgnoreSecurityIssue: string, ignore: boolean) => {
    if (securityIgnore !== '*') {
      const newChecksToIgnore = ignore
        ? [...(securityIgnore ?? []), currentIgnoreSecurityIssue]
        : securityIgnore?.filter((securityIssue) => securityIssue !== currentIgnoreSecurityIssue) ?? []
      ignoreNode({
        workspaceId: selectedWorkspace?.id ?? '',
        nodeId: resourceDetailId,
        data: {
          checks: newChecksToIgnore.length ? newChecksToIgnore : null,
        },
      })
    }
  }
  const handleAllToggle = () => {
    ignoreNode({
      workspaceId: selectedWorkspace?.id ?? '',
      nodeId: resourceDetailId,
      data: {
        checks: securityIgnore === '*' ? null : '*',
      },
    })
  }
  const sortedFailingChecks =
    securityIgnore !== '*' && securityIgnore
      ? failingChecks.sort((prev, next) => (securityIgnore.includes(prev.id) ? 1 : 0) - (securityIgnore.includes(next.id) ? 1 : 0))
      : failingChecks ?? []
  const otherIgnoredChecks =
    (securityIgnore !== '*' &&
      securityIgnore
        ?.map((ignore, i) => [ignore, securityIgnoreTitles?.[i] ?? ''])
        .filter(([item]) => !sortedFailingChecks.find((i) => i.id === item))) ||
    []
  return (
    <Accordion defaultExpanded>
      <ResourceDetailAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Trans>Security Issues</Trans>
          <FailedCheckIgnoreButton
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation()
              handleAllToggle()
            }}
            ignored={securityIgnore === '*'}
            size="small"
            pending={isPending}
            startIcon={securityIgnore === '*' ? <DoneAllIcon /> : undefined}
          >
            {securityIgnore === '*' ? <Trans>Enable all</Trans> : <Trans>Ignore all</Trans>}
          </FailedCheckIgnoreButton>
        </Stack>
      </ResourceDetailAccordionSummary>
      <Divider />
      <AccordionDetails>
        {sortedFailingChecks.map((failedCheck, i) => (
          <Fragment key={i}>
            <Paper elevation={1}>
              <FailedChecks
                failedCheck={failedCheck}
                ignoreProps={
                  securityIgnore !== '*'
                    ? {
                        currentIgnoreSecurityIssue: failedCheck.id,
                        pending: isPending,
                        onToggle: handleToggle,
                      }
                    : undefined
                }
                smallText
                ignored={securityIgnore === '*' || ((securityIgnore && securityIgnore.includes(failedCheck.id)) ?? undefined)}
                benchmarks={nodeSecurityIssues
                  .find((issue) => issue.check === failedCheck.id)
                  ?.benchmarks.map((benchmark) => snakeCaseWordsToUFStr(benchmark))}
              />
            </Paper>
            <Divider />
          </Fragment>
        ))}
        {securityIgnore === '*' || otherIgnoredChecks.length ? (
          <ResourceDetailFailedCheckIgnoredChecks
            handleAllToggle={handleAllToggle}
            handleToggle={handleToggle}
            ignoredChecks={otherIgnoredChecks}
            isPending={isPending}
            securityIgnore={securityIgnore as string[] | '*'}
          />
        ) : null}

        {/* <Grid gap={2} gridTemplateColumns="150px 1fr" display="grid">
        <GridItem
          property={<Trans>Found at</Trans>}
          value={`${new Date(data.resource.security.opened_at).toLocaleDateString(locale)} ${new Date(
            data.resource.security.opened_at,
          ).toLocaleTimeString(locale)}`}
        />
        <GridItem
          property={<Trans>Severity</Trans>}
          value={snakeCaseWordsToUFStr(data.resource.security.severity)}
          color={getColorBySeverity(data.resource.security.severity)}
        />
        <GridItem property={<Trans>Issues</Trans>} value={null} isReactNode />

        {data.resource.security.issues.map((issue, i) => (
          <Fragment key={i}>
            <Divider />
            <Divider />
            <GridItem property={<Trans>Check</Trans>} value={issue.check} />
            <GridItem
              property={<Trans>Found at</Trans>}
              value={`${new Date(issue.opened_at).toLocaleDateString(locale)} ${new Date(issue.opened_at).toLocaleTimeString(locale)}`}
            />
            <GridItem
              property={<Trans>Severity</Trans>}
              color={getColorBySeverity(issue.severity)}
              value={snakeCaseWordsToUFStr(issue.severity)}
            />
          </Fragment>
        ))}
      </Grid> */}
      </AccordionDetails>
    </Accordion>
  )
}
