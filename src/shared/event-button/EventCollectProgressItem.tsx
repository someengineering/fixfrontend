import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, LinearProgress, Typography } from '@mui/material'
import { TreeItem, TreeView } from '@mui/x-tree-view'
import { CollectProgressEvent } from 'src/shared/types/server'
import { FormattedProgressEventParts, formatProgressEventParts } from './formatProgressEventParts'

interface EventCollectProgressItemProps {
  data: CollectProgressEvent
}

interface ShowTreeViewProps extends FormattedProgressEventParts {}

const ShowTreeView = ({ current, name, path, total, detail }: ShowTreeViewProps) => {
  const done = current === total
  const color = done ? 'success' : 'primary'
  const themeColor = `${color}.main`
  return (
    <TreeItem
      color={themeColor}
      nodeId={path}
      label={
        <Box display="flex" flexDirection="column">
          <Typography variant="h5" mb={1} color={themeColor}>
            {name} <Typography variant="caption">{done ? 'done' : `${current}/${total}`}</Typography>
          </Typography>
          <LinearProgress
            variant={done ? 'determinate' : 'buffer'}
            value={(current / total) * 100}
            valueBuffer={done ? undefined : (current / total) * 100}
            color={color}
          />
        </Box>
      }
    >
      {detail?.map((subPart, i) => <ShowTreeView key={i} {...subPart} />)}
    </TreeItem>
  )
}

export const EventCollectProgressItem = ({ data }: EventCollectProgressItemProps) => {
  const formattedProgress = formatProgressEventParts(data.data.message.parts, data.data.message.name)
  formattedProgress.name += ` (${data.data.task})`

  return (
    <TreeView defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
      <ShowTreeView {...formattedProgress} />
    </TreeView>
  )
}
