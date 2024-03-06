import { useLingui } from '@lingui/react'
import { TimelineConnector, TimelineContent, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab'
import { Box, ButtonBase, Typography } from '@mui/material'
import { WorkspaceInventoryNodeHistory } from 'src/shared/types/server'
import { nodeChangeToDescription, nodeChangeToIcon, nodeChangeToStr } from './nodeChange'

interface ResourceDetailChangeLogHistoryProps {
  history: WorkspaceInventoryNodeHistory
  onClick: (params: [HTMLElement | null, WorkspaceInventoryNodeHistory]) => void
}

export const ResourceDetailChangeLogHistory = ({ history, onClick }: ResourceDetailChangeLogHistoryProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  return (
    <TimelineItem>
      <TimelineOppositeContent
        component={ButtonBase}
        m="auto 0"
        align="right"
        variant="body2"
        color="text.secondary"
        borderRadius={2}
        display="flex"
        alignItems="center"
        onClick={(e) => onClick([e.currentTarget, history])}
      >
        <Box flex={1}>
          <Typography variant="h6" component="span">
            {nodeChangeToStr(history.change)}
          </Typography>
          <br />
          {new Date(history.changed_at).toLocaleDateString(locale)}
        </Box>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        {nodeChangeToIcon(history.change, (e) => onClick([e.currentTarget, history]))}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        component={ButtonBase}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        borderRadius={2}
        px={2}
        my={2.5}
        gap={1}
        onClick={(e) => onClick([e.currentTarget, history])}
      >
        {nodeChangeToDescription(history, locale)}
      </TimelineContent>
    </TimelineItem>
  )
}
