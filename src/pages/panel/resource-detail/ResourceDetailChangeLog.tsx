import { Trans } from '@lingui/macro'
import { Timeline } from '@mui/lab'
import { Accordion, AccordionDetails, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryNodeHistoryQuery } from 'src/pages/panel/shared/queries'
import { sortedSeverities } from 'src/shared/constants'
import { Spinner } from 'src/shared/loading'
import { StickyAccordionSummaryWithIcon } from 'src/shared/sticky-accordion-summary'
import { WorkspaceInventoryNode, WorkspaceInventoryNodeHistory } from 'src/shared/types/server'
import { ResourceDetailChangeLogHistory, ResourceDetailChangeLogSelectedHistory } from './utils'

interface ResourceDetailChangeLogProps {
  notFound?: boolean
  defaultResource?: WorkspaceInventoryNode['resource']
}

export const ResourceDetailChangeLog = ({ notFound, defaultResource }: ResourceDetailChangeLogProps) => {
  const [expanded, setExpanded] = useState(false)
  const [[historyAnchorEl, selectedHistory], setHistory] = useState<[HTMLElement | null, WorkspaceInventoryNodeHistory | undefined]>([
    null,
    undefined,
  ])
  const { selectedWorkspace } = useUserProfile()
  const { resourceDetailId } = useParams()
  const {
    data: orgData,
    isLoading,
    isFetched,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['workspace-inventory-node-history', selectedWorkspace?.id, resourceDetailId, undefined, undefined, undefined, undefined],
    queryFn: getWorkspaceInventoryNodeHistoryQuery,
    throwOnError: false,
    enabled: !!resourceDetailId && expanded,
  })
  const data = useMemo(() => {
    if (isFetched) {
      return orgData && orgData[orgData.length - 1]?.change === 'node_created'
        ? orgData
        : [
            ...(orgData ?? []),
            ...(defaultResource
              ? [
                  {
                    change: 'node_created',
                    changed_at: defaultResource.reported.ctime,
                    created: defaultResource.reported.ctime,
                    id: Math.random().toString(),
                    metadata: defaultResource.metadata,
                    reported: defaultResource.reported,
                    revision: defaultResource.revision,
                    type: 'node',
                    updated: defaultResource.reported.ctime,
                    ancestors: defaultResource.ancestors,
                  } as WorkspaceInventoryNodeHistory,
                ]
              : []),
          ]
    }
  }, [isFetched, defaultResource, orgData])
  useEffect(() => {
    if (notFound) {
      setExpanded(true)
    }
  }, [notFound])
  const onClosePopup = () => setHistory((prev) => [null, prev[1]])

  return (isError || isSuccess) && !data?.length ? null : (
    <>
      <Accordion expanded={expanded} onChange={(_, value) => setExpanded(value)}>
        <StickyAccordionSummaryWithIcon offset={6}>
          <Trans>Changes</Trans>
        </StickyAccordionSummaryWithIcon>
        <Divider />
        <AccordionDetails>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" height={250}>
              <Spinner isLoading />
            </Stack>
          ) : error ? (
            <Typography color="error.main">
              <Trans>Failed to retrieve changelog</Trans>
            </Typography>
          ) : data?.length ? (
            <Timeline position="right">
              {data.map((history, i) => (
                <ResourceDetailChangeLogHistory
                  history={
                    history.change === 'node_vulnerable' || history.change === 'node_compliant'
                      ? {
                          ...history,
                          diff: {
                            node_compliant: history.diff.node_compliant?.sort(
                              (a, b) =>
                                sortedSeverities.findIndex((i) => i === a.severity) - sortedSeverities.findIndex((i) => i === b.severity),
                            ),
                            node_vulnerable: history.diff.node_vulnerable?.sort(
                              (a, b) =>
                                sortedSeverities.findIndex((i) => i === a.severity) - sortedSeverities.findIndex((i) => i === b.severity),
                            ),
                          },
                        }
                      : history
                  }
                  onClick={setHistory}
                  key={history.id + i}
                />
              ))}
            </Timeline>
          ) : null}
        </AccordionDetails>
        <Divider />
      </Accordion>
      <ResourceDetailChangeLogSelectedHistory
        historyAnchorEl={historyAnchorEl}
        onClosePopup={onClosePopup}
        selectedHistory={selectedHistory}
      />
    </>
  )
}
