import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Divider, IconButton, Popover, Stack, Typography } from '@mui/material'
import { diffJson } from 'diff'
import { WorkspaceInventoryNodeHistory } from 'src/shared/types/server'
import { YamlHighlighter } from 'src/shared/yaml-highlighter'
import { stringify } from 'yaml'
import { ResourceDetailChangeLogSelectedHistoryAccordion } from './ResourceDetailChangeLogSelectedHistoryAccordion'
import { nodeChangeToIcon, nodeChangeToStr } from './nodeChange'

interface ResourceDetailChangeLogSelectedHistoryProps {
  historyAnchorEl: HTMLElement | null
  selectedHistory: WorkspaceInventoryNodeHistory | undefined
  onClosePopup: () => void
}

export const ResourceDetailChangeLogSelectedHistory = ({
  historyAnchorEl,
  selectedHistory,
  onClosePopup,
}: ResourceDetailChangeLogSelectedHistoryProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const { age: _age, last_update: _lastUpdate, time_created: _timeCreated, ...selectedHistoryReported } = selectedHistory?.reported ?? {}
  return (
    <Popover
      open={!!historyAnchorEl}
      onClose={onClosePopup}
      anchorEl={historyAnchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
      transformOrigin={{ horizontal: 'right', vertical: 'center' }}
    >
      {selectedHistory ? (
        <>
          <Stack width="100%" p={2} justifyContent="space-between" alignItems="center" direction="row" boxShadow={12} spacing={1}>
            <Stack spacing={1} direction="row" alignItems="center">
              {nodeChangeToIcon(selectedHistory.change)}
              <Typography variant="h5">{nodeChangeToStr(selectedHistory.change)}</Typography>
            </Stack>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography textAlign="right" color="primary.main">
                {new Date(selectedHistory.changed_at).toLocaleDateString(locale)}{' '}
                {new Date(selectedHistory.changed_at).toLocaleTimeString(locale)}
              </Typography>
              <IconButton onClick={onClosePopup}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Divider />
          <Box p={2} overflow="auto" maxHeight={({ spacing }) => `calc(100vh - ${spacing(13.125)})`}>
            {selectedHistory.change === 'node_updated' ? (
              diffJson(selectedHistory.before, selectedHistoryReported).map((part, i) => (
                <Typography component="pre" color={part.added ? 'success.main' : part.removed ? 'error.main' : undefined} key={i}>
                  <code>{part.value}</code>
                </Typography>
              ))
            ) : selectedHistory.change === 'node_created' || selectedHistory.change === 'node_deleted' ? (
              <Typography component="pre">
                <code>
                  <YamlHighlighter>{stringify(selectedHistory.reported, null, '  ')}</YamlHighlighter>
                </code>
              </Typography>
            ) : (
              <Stack>
                {selectedHistory.diff.node_compliant.length ? (
                  <Stack py={1}>
                    <Typography variant="h5">
                      <Trans>Improved</Trans>
                    </Typography>
                  </Stack>
                ) : null}
                {selectedHistory.diff.node_compliant.map((item, i) => (
                  <ResourceDetailChangeLogSelectedHistoryAccordion data={item} key={i} />
                ))}
                {selectedHistory.diff.node_vulnerable.length ? (
                  <Stack py={1} spacing={1}>
                    <Typography variant="h4">
                      <Trans>Compliance</Trans>
                    </Typography>
                  </Stack>
                ) : null}
                {selectedHistory.diff.node_vulnerable.map((item, i) => (
                  <ResourceDetailChangeLogSelectedHistoryAccordion data={item} isVulnerable key={i} />
                ))}
              </Stack>
            )}
          </Box>
        </>
      ) : null}
    </Popover>
  )
}
