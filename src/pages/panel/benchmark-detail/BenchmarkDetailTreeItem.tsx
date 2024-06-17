import { Stack, Typography } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view'
import { getColorBySeverity, getIconBySeverity } from 'src/pages/panel/shared/utils'
import { getMessage } from 'src/shared/defined-messages'
import { BenchmarkCheckCollectionNode, BenchmarkCheckResultNode } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

export interface BenchmarkCheckCollectionNodeWithChildren {
  nodeId: string
  parent?: BenchmarkCheckCollectionNodeWithChildren
  children?: BenchmarkCheckCollectionNodeWithChildren[]
  reported: BenchmarkCheckCollectionNode | BenchmarkCheckResultNode
  severity?: SeverityType
  numberOfResourceFailing: number
}

export interface BenchmarkDetailTreeItemProps {
  item: BenchmarkCheckCollectionNodeWithChildren
}

const BenchmarkDetailTreeItemLabel = ({ item }: BenchmarkDetailTreeItemProps) => {
  const severity = item.numberOfResourceFailing && item.severity ? item.severity : 'passed'
  const color = getColorBySeverity(severity)
  const Comp = getIconBySeverity(severity)
  return (
    <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center" fontWeight={600} id={`item-${item.nodeId}`}>
      {item.reported.name}
      <Stack direction="row" justifyContent="end" flexGrow={1} flexShrink={0} spacing={1} alignItems="center">
        <Typography color={color} variant="caption" fontWeight={700}>
          {getMessage(snakeCaseToUFStr(severity))}
        </Typography>
        <Comp fontSize="small" sx={{ color }} />
      </Stack>
    </Stack>
  )
}

export const BenchmarkDetailTreeItem = ({ item }: BenchmarkDetailTreeItemProps) => {
  return (
    <TreeItem itemId={item.nodeId} label={<BenchmarkDetailTreeItemLabel item={item} />} sx={{ py: 1 }}>
      {item.children?.map((child) =>
        child.reported.kind === 'report_check_collection' ? (
          <BenchmarkDetailTreeItem key={child.nodeId} item={child} />
        ) : (
          <TreeItem key={child.nodeId} itemId={child.nodeId} label={<BenchmarkDetailTreeItemLabel item={child} />} sx={{ py: 1 }} />
        ),
      )}
    </TreeItem>
  )
}
