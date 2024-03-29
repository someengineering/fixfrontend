import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Timeline } from '@mui/lab'
import { Accordion, AccordionDetails, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryNodeHistoryQuery } from 'src/pages/panel/shared/queries'
import { Spinner } from 'src/shared/loading'
import { WorkspaceInventoryNodeHistory } from 'src/shared/types/server'
import { ResourceDetailAccordionSummary } from './ResourceDetail'
import { ResourceDetailChangeLogHistory } from './utils'
import { ResourceDetailChangeLogSelectedHistory } from './utils/ResourceDetailChangeLogSelectedHistory'

interface ResourceDetailChangeLogProps {
  notFound?: boolean
}
const severities = ['critical', 'high', 'medium', 'low', 'info']
export const ResourceDetailChangeLog = ({ notFound }: ResourceDetailChangeLogProps) => {
  const [expanded, setExpanded] = useState(false)
  const [[historyAnchorEl, selectedHistory], setHistory] = useState<[HTMLElement | null, WorkspaceInventoryNodeHistory | undefined]>([
    null,
    undefined,
  ])
  const { selectedWorkspace } = useUserProfile()
  const { resourceDetailId } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['workspace-inventory-node-history', selectedWorkspace?.id, resourceDetailId, undefined, undefined, undefined, undefined],
    queryFn: getWorkspaceInventoryNodeHistoryQuery,
    throwOnError: false,
    enabled: !!resourceDetailId && expanded,
  })
  useEffect(() => {
    if (notFound) {
      setExpanded(true)
    }
  }, [notFound])
  const onClosePopup = () => setHistory((prev) => [null, prev[1]])
  return data?.length || isLoading || error || !expanded ? (
    <>
      <Accordion expanded={expanded} onChange={(_, value) => setExpanded(value)}>
        <ResourceDetailAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Trans>Changes</Trans>
        </ResourceDetailAccordionSummary>
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
                              (a, b) => severities.findIndex((i) => i === a.severity) - severities.findIndex((i) => i === b.severity),
                            ),
                            node_vulnerable: history.diff.node_vulnerable?.sort(
                              (a, b) => severities.findIndex((i) => i === a.severity) - severities.findIndex((i) => i === b.severity),
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
  ) : null
}
