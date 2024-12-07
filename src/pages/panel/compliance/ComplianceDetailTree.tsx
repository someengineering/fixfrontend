import { SimpleTreeView, treeItemClasses } from '@mui/x-tree-view'
import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronRightIcon, KeyboardArrowDownIcon } from 'src/assets/icons'
import { FrameworkIcon } from 'src/pages/panel/shared/utils'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { ComplianceCheckCollectionNodeWithChildren, ComplianceDetailTreeItem } from './ComplianceDetailTreeItem'

interface ComplianceDetailTreeProps {
  dataWithChildren: ComplianceCheckCollectionNodeWithChildren[]
  allData: Record<string, ComplianceCheckCollectionNodeWithChildren>
  benchmarkId?: string
  accountId?: string
  checkId?: string
  accountName?: string
  showEmpty: boolean
}

export const ComplianceDetailTree = ({
  allData,
  dataWithChildren,
  accountId,
  benchmarkId,
  checkId,
  accountName,
  showEmpty,
}: ComplianceDetailTreeProps) => {
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

  const handleSelect = useCallback(
    (_: unknown, itemId: string | null) => {
      if (itemId) {
        const expandedItems = getLocationSearchValues()['expanded-items']?.split(',') ?? []
        let pathname = `/compliance/${benchmarkId}${accountId ? `/${accountId}` : ''}`
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
            let item: ComplianceCheckCollectionNodeWithChildren | undefined = allData[selectedCheckId];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SimpleTreeView
      key={0}
      expandedItems={expandedItems}
      selectedItems={selectedId}
      slots={{ expandIcon: ChevronRightIcon, collapseIcon: KeyboardArrowDownIcon }}
      sx={{
        [`& .${treeItemClasses.iconContainer}`]: { width: 24, svg: { minWidth: 24, minHeight: 24 } },
        [`.${treeItemClasses.content}`]: { px: 0 },
      }}
      onSelectedItemsChange={handleSelect}
    >
      {dataWithChildren.map((item) => (
        <ComplianceDetailTreeItem
          key={item.nodeId}
          item={item}
          firstItem
          frameworkIcon={benchmarkId && <FrameworkIcon frameworkId={benchmarkId} width={40} height={40} />}
          showEmpty={showEmpty}
          accountName={accountName}
        />
      ))}
    </SimpleTreeView>
  )
}
