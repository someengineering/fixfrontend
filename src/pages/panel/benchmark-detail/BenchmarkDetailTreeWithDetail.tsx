import { SimpleTreeView, treeItemClasses } from '@mui/x-tree-view'
import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { BenchmarkReportNode } from 'src/shared/types/server'
import { NodeType } from 'src/shared/types/server-shared'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
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
  accountName?: string
  checkId?: string
}

export const BenchmarkDetailTreeWithDetail = ({
  benchmarkDetail,
  checkId,
  allData,
  accountId,
  accountName,
  benchmarkId,
  dataWithChildren,
}: BenchmarkDetailTreeWithDetailProps) => {
  const navigate = useAbsoluteNavigate()
  const params = useSearchParams()[0]
  const expandedItems = params.get('expanded-items')?.split(',') ?? []
  const selectedId = params.get('selected-id')
  const previousSelected = useRef(selectedId)
  const oneParentId = dataWithChildren.length === 1 ? dataWithChildren[0].nodeId : undefined

  const navigateWithQueryParams = useCallback(
    (selectedId?: string | null, expandedItems?: string[], pathname?: string) => {
      const prevSearch = window.location.search
      const prevPathname = window.location.pathname?.split('?')?.[0]?.split('#')?.[0]
      const newPathname = pathname ?? window.location.pathname?.split('?')?.[0]?.split('#')?.[0]
      const searches = getLocationSearchValues()
      const newExpandedItems = [...new Set(expandedItems?.filter((i) => i) ?? searches['expanded-items'].split(',').filter((i) => i))]
      const newSelectedId = selectedId === undefined ? searches['selected-id'] : selectedId
      if (newExpandedItems.length) {
        searches['expanded-items'] = newExpandedItems.join(',')
      } else {
        delete searches['expanded-items']
      }
      if (newSelectedId) {
        searches['selected-id'] = newSelectedId
      } else {
        delete searches['selected-id']
      }
      const newSearch = mergeLocationSearchValues(searches)
      if (prevSearch !== newSearch || prevPathname !== newPathname) {
        navigate({ pathname: newPathname, search: newSearch })
      }
    },
    [navigate],
  )

  useEffect(() => {
    const allDataEntries = Object.entries(allData)
    if (checkId && allDataEntries.length) {
      const selectedId = getLocationSearchValues()['selected-id']
      const filteredChecks = allDataEntries.filter(
        ([_, item]) => item.reported.kind === 'report_check_result' && item.reported.id === checkId,
      )
      const foundCheck = filteredChecks.find((check) => check[0] === selectedId)
      if (!foundCheck?.[0] && filteredChecks.length) {
        // process
        const selectedCheck = filteredChecks[0]
        const selectedCheckId = selectedCheck[0]
        if (selectedCheckId && allData[selectedCheckId]) {
          const expandedItems = []
          for (
            let item: BenchmarkCheckCollectionNodeWithChildren | undefined = allData[selectedCheckId];
            item;
            item = 'parent' in item ? item.parent : undefined
          ) {
            expandedItems.push(item.nodeId)
          }
          if (oneParentId) {
            expandedItems.push(oneParentId)
          }
          navigateWithQueryParams(selectedCheckId, expandedItems)
        }
      }
    } else if (oneParentId) {
      const searches = getLocationSearchValues()
      navigateWithQueryParams(undefined, [...(searches['expanded-items'] ?? '').split(','), oneParentId])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleManualSelect = useCallback(
    (itemId: string | null) => {
      if (itemId && allData[itemId]) {
        const expandedItems = getLocationSearchValues()['expanded-items']?.split(',') ?? []
        for (
          let item: BenchmarkCheckCollectionNodeWithChildren | undefined = allData[itemId];
          item;
          item = 'parent' in item ? item.parent : undefined
        ) {
          expandedItems.push(item.nodeId)
        }
        let pathname = `/benchmark/${benchmarkId}${accountId ? `/${accountId}` : ''}`
        const item = allData[itemId]
        if (item.reported.kind === 'report_check_result') {
          pathname = `${pathname}/check-detail/${item.reported.id}`
        }
        navigateWithQueryParams(itemId, expandedItems, pathname)
      }
    },
    [accountId, allData, benchmarkId, navigateWithQueryParams],
  )

  const handleSelect = useCallback(
    (_: unknown, itemId: string | null) => {
      if (itemId) {
        const expandedItems = getLocationSearchValues()['expanded-items']?.split(',') ?? []
        let pathname = `/benchmark/${benchmarkId}${accountId ? `/${accountId}` : ''}`
        const foundExpandedItemIndex = expandedItems.indexOf(itemId)
        if (!oneParentId || expandedItems[foundExpandedItemIndex] !== oneParentId) {
          if (foundExpandedItemIndex > -1 && previousSelected.current === itemId) {
            expandedItems.splice(foundExpandedItemIndex, 1)
          } else {
            expandedItems.push(itemId)
          }
        }
        previousSelected.current = itemId
        const item = allData[itemId]
        if (item) {
          if (item.reported.kind === 'report_check_result') {
            pathname = `${pathname}/check-detail/${item.reported.id}`
          }
          navigateWithQueryParams(itemId, expandedItems, pathname)
          return
        }
      }
      navigateWithQueryParams(null)
    },
    // basically accountId, allData, benchmarkId
    [accountId, allData, benchmarkId, navigateWithQueryParams, oneParentId],
  )

  useEffect(() => {
    if (selectedId) {
      window.document.getElementById(selectedId)?.scrollIntoView({ behavior: 'smooth' })
      const timeout = window.setTimeout(
        () => window.document.getElementById(`item-${selectedId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        500,
      )
      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [selectedId])

  const currentData = selectedId ? allData[selectedId] : undefined

  const hasData = currentData?.reported

  return (
    <BenchmarkDetailSplitter>
      {[
        <SimpleTreeView
          key={0}
          expandedItems={expandedItems}
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
            <BenchmarkCheckCollectionDetail
              key={1}
              id={currentData.nodeId}
              bench={currentData.reported}
              child={currentData.children}
              onSelect={handleManualSelect}
              isManual={currentData.isManual}
            />
          ) : (
            <BenchmarkDetailCheckDetail
              key={2}
              id={currentData.nodeId}
              check={currentData?.reported}
              accountName={accountName === accountId ? undefined : accountName}
              description={
                currentData?.parent?.reported?.kind === 'report_check_collection' ? currentData?.parent.reported.description : undefined
              }
            />
          )
        ) : benchmarkDetail ? (
          <BenchmarkDetailView
            key={3}
            id={benchmarkDetail.id}
            benchmarkDetail={benchmarkDetail.reported}
            child={dataWithChildren}
            onSelect={handleManualSelect}
          />
        ) : null,
      ]}
    </BenchmarkDetailSplitter>
  )
}
