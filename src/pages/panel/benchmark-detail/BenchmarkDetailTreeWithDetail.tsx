import { Stack } from '@mui/material'
import { SimpleTreeView, treeItemClasses } from '@mui/x-tree-view'
import { useEffect, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { BenchmarkReportNode } from 'src/shared/types/server'
import { NodeType } from 'src/shared/types/server-shared'
import { BenchmarkCheckCollectionDetail } from './BenchmarkCheckCollectionDetail'
import { BenchmarkDetailCheckDetail } from './BenchmarkDetailCheckDetail'
import { BenchmarkDetailSplitter } from './BenchmarkDetailSplitter'
import { BenchmarkCheckCollectionNodeWithChildren, BenchmarkDetailTreeItem } from './BenchmarkDetailTreeItem'
import { BenchmarkDetailView } from './BenchmarkDetailView'

export interface BenchmarkDetailTreeWithDetailProps {
  benchmarkDetail?: NodeType<{ reported: BenchmarkReportNode }>
  dataWithChildren: BenchmarkCheckCollectionNodeWithChildren[]
  allData: Record<string, BenchmarkCheckCollectionNodeWithChildren>
  benchmarkId?: string
  accountId?: string
  checkId?: string
}

export const BenchmarkDetailTreeWithDetail = ({
  benchmarkDetail,
  checkId,
  allData,
  accountId,
  benchmarkId,
  dataWithChildren,
}: BenchmarkDetailTreeWithDetailProps) => {
  const navigate = useAbsoluteNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(
    () =>
      (checkId &&
        Object.entries(allData).find(([_, item]) => item.reported.kind === 'report_check_result' && item.reported.id === checkId)?.[0]) ||
      null,
  )
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    if (selectedId && allData[selectedId]) {
      const result: string[] = []
      for (
        let item: BenchmarkCheckCollectionNodeWithChildren | undefined = allData[selectedId];
        item;
        item = 'parent' in item ? item.parent : undefined
      ) {
        result.push(item.nodeId)
      }
      return result
    }
    return []
  })

  const initiated = useRef(false)

  useEffect(() => {
    if (!initiated.current) {
      initiated.current = true
    } else if (checkId) {
      setSelectedId(
        () =>
          (checkId &&
            Object.entries(allData).find(
              ([_, item]) => item.reported.kind === 'report_check_result' && item.reported.id === checkId,
            )?.[0]) ||
          null,
      )
    }
  }, [allData, checkId])

  useEffect(() => {
    if (selectedId && allData[selectedId]) {
      setExpandedItems((prev) => {
        const result = [...prev]
        for (
          let item: BenchmarkCheckCollectionNodeWithChildren | undefined = allData[selectedId];
          item;
          item = 'parent' in item ? item.parent : undefined
        ) {
          result.push(item.nodeId)
        }
        return result
      })
    }
  }, [selectedId, allData])

  const handleSelect = (_: unknown, itemId: string | null) => {
    if (itemId) {
      const item = allData[itemId]
      if (item) {
        if (item.reported.kind === 'report_check_result') {
          navigate(`/benchmark/${benchmarkId}${accountId ? `/${accountId}` : ''}/check-detail/${item.reported.id}`)
        } else {
          navigate(`/benchmark/${benchmarkId}${accountId ? `/${accountId}` : ''}`)
        }
        setSelectedId(() => {
          window.setTimeout(() => window.document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth' }))
          return itemId
        })
        return
      }
    }
    setSelectedId(null)
  }

  const currentData = selectedId ? allData[selectedId] : undefined

  const hasData = currentData?.reported

  return (
    <BenchmarkDetailSplitter>
      {[
        <SimpleTreeView
          key={0}
          expandedItems={expandedItems}
          onExpandedItemsChange={(_, items) => setExpandedItems(items)}
          selectedItems={selectedId}
          slots={{
            // expandIcon: FiberManualRecordIcon,
            // collapseIcon: FiberManualRecordOutlinedIcon,
            endIcon: () => '•',
          }}
          sx={{
            [`& .${treeItemClasses.iconContainer}`]: ({
              palette: {
                primary: { main },
              },
            }) => ({
              fill: main,
              color: main,
            }),
          }}
          onSelectedItemsChange={handleSelect}
        >
          {dataWithChildren.map((item) => (
            <BenchmarkDetailTreeItem key={item.nodeId} item={item} />
          ))}
        </SimpleTreeView>,
        hasData ? (
          currentData.reported.kind === 'report_check_collection' ? (
            <Stack id={currentData.nodeId} key={1} spacing={1} height="100%">
              <BenchmarkCheckCollectionDetail bench={currentData.reported} child={currentData.children} />
            </Stack>
          ) : (
            <Stack id={currentData.nodeId} key={2} spacing={1} height="100%" mb={1}>
              <BenchmarkDetailCheckDetail check={currentData?.reported} />
            </Stack>
          )
        ) : benchmarkDetail ? (
          <Stack id={benchmarkDetail.id} key={3} spacing={1} height="100%">
            <BenchmarkDetailView benchmarkDetail={benchmarkDetail.reported} child={dataWithChildren} />
          </Stack>
        ) : null,
      ]}
    </BenchmarkDetailSplitter>
  )
}
