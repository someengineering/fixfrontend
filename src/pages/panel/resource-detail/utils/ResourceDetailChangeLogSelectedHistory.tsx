import { useLingui } from '@lingui/react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Divider, IconButton, Popover, Stack, Typography, alpha, colors } from '@mui/material'
import { diffLines } from 'diff'
import { WorkspaceInventoryNodeHistory } from 'src/shared/types/server'
import { YamlHighlighter } from 'src/shared/yaml-highlighter'
import { stringify } from 'yaml'
import { ResourceDetailChangeLogSelectedHistoryDiff } from './ResourceDetailChangeLogSelectedHistoryDiff'
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
              {nodeChangeToIcon(selectedHistory)}
              <Typography variant="h5">{nodeChangeToStr(selectedHistory)}</Typography>
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
              diffLines(stringify(selectedHistory.before), stringify(selectedHistoryReported)).map((part, i) => (
                <Box key={i} ml={1}>
                  <Typography
                    flexGrow={1}
                    component="pre"
                    position="relative"
                    bgcolor={part.added ? alpha(colors.green.A700, 0.15) : part.removed ? alpha(colors.red.A700, 0.15) : undefined}
                  >
                    <code>
                      {part.added || part.removed ? (
                        <Box
                          display="block"
                          position="absolute"
                          left={-16}
                          width={16}
                          pl={0.5}
                          bgcolor={part.added ? alpha(colors.green.A700, 0.3) : part.removed ? alpha(colors.red.A700, 0.3) : undefined}
                        >
                          {part.added ? '+' : '-'}
                        </Box>
                      ) : null}
                      <YamlHighlighter>{part.value}</YamlHighlighter>
                    </code>
                  </Typography>
                </Box>
              ))
            ) : selectedHistory.change === 'node_compliant' || selectedHistory.change === 'node_vulnerable' ? (
              <ResourceDetailChangeLogSelectedHistoryDiff {...selectedHistory.diff} />
            ) : (
              <Typography component="pre">
                <code>
                  <YamlHighlighter>{stringify(selectedHistory.reported, null, '  ')}</YamlHighlighter>
                </code>
              </Typography>
            )}
          </Box>
        </>
      ) : null}
    </Popover>
  )
}
