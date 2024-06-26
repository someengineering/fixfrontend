import { Box, LinearProgress, Typography } from '@mui/material'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { CollectProgressEvent } from 'src/shared/types/server'
import { FormattedProgressEventParts, formatProgressEventParts } from './formatProgressEventParts'

interface EventCollectProgressItemProps {
  parts: CollectProgressEvent['data']['message']['parts']
}

const ShowTreeView = ({ current, name, path, total, detail }: FormattedProgressEventParts) => {
  const done = current === total
  const color = done ? 'success' : 'primary'
  const themeColor = `${color}.main`
  return (
    <TreeItem
      color={themeColor}
      itemId={path}
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

export const EventCollectProgressItem = ({ parts }: EventCollectProgressItemProps) => {
  const formattedProgress = formatProgressEventParts(parts).detail
  // formattedProgress.name += ` (${data.data.task})`

  return <SimpleTreeView>{formattedProgress?.map((item, i) => <ShowTreeView {...item} key={i} />)}</SimpleTreeView>
}
