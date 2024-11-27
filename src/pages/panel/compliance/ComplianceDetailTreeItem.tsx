import { styled } from '@mui/material'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view'
import { ReactNode } from 'react'
import { BenchmarkCheckCollectionNode, BenchmarkCheckResultNode } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { ComplianceDetailTreeItemLabel } from './ComplianceDetailTreeItemLabel'
import { ComplianceDetailTreeItemTable } from './ComplianceDetailTreeItemTable'

export interface ComplianceCheckCollectionNodeWithChildren {
  nodeId: string
  parent?: ComplianceCheckCollectionNodeWithChildren
  children?: ComplianceCheckCollectionNodeWithChildren[]
  reported: BenchmarkCheckCollectionNode | BenchmarkCheckResultNode
  severity?: SeverityType
  numberOfResourceFailing: number
  numberOfChecksFailing: number
  totalChecks: number
  isManual: boolean
}

export interface ComplianceDetailTreeItemProps {
  item: ComplianceCheckCollectionNodeWithChildren
  accountName?: string
  firstItem?: boolean
  endItem?: boolean
  frameworkIcon?: ReactNode
  showEmpty?: boolean
}

const StyledTreeItem = styled(TreeItem, { shouldForwardProp: shouldForwardPropWithBlackList(['firstItem', 'endItem']) })<{
  firstItem?: boolean
  endItem?: boolean
}>(({ theme: { palette }, firstItem, endItem }) => ({
  py: 1.5,
  px: 0,
  borderTop: firstItem ? `1px solid ${palette.divider}` : undefined,
  [`.${treeItemClasses.content}`]: { minHeight: 38 },
  [`.${treeItemClasses.selected}`]: { backgroundColor: 'transparent' },
  [`.${treeItemClasses.focused}`]: { backgroundColor: 'transparent' },
  '--TreeView-itemChildrenIndentation': endItem ? 0 : '41px',
}))

export const ComplianceDetailTreeItem = ({ item, firstItem, accountName, frameworkIcon, showEmpty }: ComplianceDetailTreeItemProps) => {
  const collectionChildren = item.children?.filter((child) => child.reported.kind === 'report_check_collection')
  const resultChildren = item.children?.filter(
    (child) => child.reported.kind === 'report_check_result',
  ) as (ComplianceCheckCollectionNodeWithChildren & { reported: BenchmarkCheckResultNode })[]
  return showEmpty || !item.isManual ? (
    <StyledTreeItem
      firstItem={firstItem}
      itemId={item.nodeId}
      label={<ComplianceDetailTreeItemLabel item={item} frameworkIcon={frameworkIcon} firstItem={firstItem} />}
      endItem={!collectionChildren?.length}
    >
      {collectionChildren?.map((child) => <ComplianceDetailTreeItem key={child.nodeId} item={child} showEmpty={showEmpty} />)}
      {resultChildren?.length ? <ComplianceDetailTreeItemTable item={resultChildren} accountName={accountName} /> : null}
    </StyledTreeItem>
  ) : null
}
