import { Stack, Typography } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
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
  return item.numberOfResourceFailing && item.severity ? (
    <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center" fontWeight={600}>
      {item.reported.name}
      <Stack alignItems="end" flexGrow={1} flexShrink={0} spacing={1}>
        <Typography color={getColorBySeverity(item.severity)} pr={2} variant="caption" fontWeight={700}>
          {getMessage(snakeCaseToUFStr(item.severity))}
        </Typography>
      </Stack>
    </Stack>
  ) : (
    item.reported.name
  )
}

export const BenchmarkDetailTreeItem = ({ item }: BenchmarkDetailTreeItemProps) => {
  return (
    <TreeItem itemId={item.nodeId} label={<BenchmarkDetailTreeItemLabel item={item} />} sx={{ py: 1 }}>
      {item.children?.map((item) =>
        item.reported.kind === 'report_check_collection' ? (
          <BenchmarkDetailTreeItem key={item.nodeId} item={item} />
        ) : (
          <TreeItem key={item.nodeId} itemId={item.nodeId} label={<BenchmarkDetailTreeItemLabel item={item} />} sx={{ py: 1 }} />
        ),
      )}
    </TreeItem>
  )
}
