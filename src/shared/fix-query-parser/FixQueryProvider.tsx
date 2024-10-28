import { useLingui } from '@lingui/react'
import { PropsWithChildren, memo } from 'react'
import { WorkspaceInventorySearchTableHistory, WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'
import {
  CombineType,
  DeleteCloudAccountRegionType,
  DeleteIsType,
  DeletePredicateType,
  FixQueryContext,
  SetCloudAccountRegionType,
  SetIsType,
  SetPredicateType,
  UpdateFullTextType,
} from './FixQueryContext'
import { JsonElement, Query } from './query'

interface FixQueryProviderProps extends PropsWithChildren {
  searchQuery?: string
  withHistory?: boolean
  history: WorkspaceInventorySearchTableHistory
  allHistory?: readonly WorkspaceInventorySearchTableHistoryChanges[]
  onChange: (searchQuery?: string, history?: WorkspaceInventorySearchTableHistory) => void
}

export const FixQueryProvider = memo(
  ({ searchQuery, onChange, withHistory, history, allHistory = [], children }: FixQueryProviderProps) => {
    useLingui()
    let query: Query | undefined
    let queryOrAll = query ?? Query.parse('all')
    let error: Error | undefined

    if (searchQuery) {
      try {
        queryOrAll = query = Query.parse(searchQuery)
      } catch (err) {
        error = err as Error
      }
    }

    function forceUpdateAndCall<Args extends unknown[]>(fn: (...args: Args) => Query) {
      return (...params: Args) => {
        const query = fn(...params)
        const result = query.toString()
        const newHistory = withHistory && !history.changes.length ? { changes: [...allHistory] } : history
        if (result === 'all') {
          onChange('', newHistory)
          return undefined
        }
        onChange(result, newHistory)
        return query
      }
    }

    const { account, cloud, parts = [], region, severity, tags = {}, aggregate, sorts = [] } = query || {}
    const value = {
      // history
      history,
      onHistoryChange: (history?: WorkspaceInventorySearchTableHistory) => onChange(query?.toString(), history),
      // default variables
      error,
      query,
      account,
      cloud,
      parts,
      region,
      severity,
      tags,
      aggregate,
      sorts,
      // get
      fullTextSearches: query?.fulltexts() ?? [],
      is: query?.is(),
      q: query?.toString() ?? '',
      predicates: query?.predicates() ?? [],
      provides_security_check_details: query?.provides_security_check_details() ?? false,
      uiSimpleQuery: query?.ui_simple_query() ?? true,
      // get methods
      findPaths: query?.find_paths.bind(query) ?? (() => []),
      // update
      combine: forceUpdateAndCall<Parameters<CombineType>>(queryOrAll.combine.bind(queryOrAll)),
      deleteIs: forceUpdateAndCall<Parameters<DeleteIsType>>(queryOrAll.delete_is.bind(queryOrAll)),
      deletePredicate: forceUpdateAndCall<Parameters<DeletePredicateType>>(queryOrAll.delete_predicate.bind(queryOrAll)),
      deleteCloudAccountRegion: forceUpdateAndCall<Parameters<DeleteCloudAccountRegionType>>(
        queryOrAll.delete_cloud_account_region.bind(queryOrAll),
      ),
      setIs: forceUpdateAndCall<Parameters<SetIsType>>(queryOrAll.set_is.bind(queryOrAll)),
      setPredicate: forceUpdateAndCall<Parameters<SetPredicateType>>(queryOrAll.set_predicate.bind(queryOrAll)),
      setCloudAccountRegion: forceUpdateAndCall<Parameters<SetCloudAccountRegionType>>(
        queryOrAll.set_cloud_account_region.bind(queryOrAll),
      ),
      updateFullTextSearch: forceUpdateAndCall<Parameters<UpdateFullTextType>>(queryOrAll.update_fulltext.bind(queryOrAll)),
      deleteMatching: query?.delete_matching.bind(queryOrAll) ?? (() => null),
      changeCloudAccountRegionFromIdToName: (name: 'cloud' | 'account' | 'region', newValue: JsonElement, op?: string) => {
        const prevPredicate = name === 'cloud' ? cloud : name === 'account' ? account : region
        const newQuery = queryOrAll
          ?.delete_cloud_account_region(name)
          .set_cloud_account_region(name, op ?? prevPredicate?.op ?? 'in', newValue, true)
        const result = newQuery.toString() ?? ''
        onChange(result, history)
        return newQuery
      },
      updateQuery: (q: string) => {
        if ((query?.toString() ?? '') !== q) {
          const newQuery = q ? Query.parse(q) : undefined
          const result = newQuery?.toString() ?? ''
          window.setTimeout(() => {
            onChange(result, history)
          })
          return newQuery
        } else {
          return query
        }
      },
      reset: () => {
        window.setTimeout(() => {
          onChange('', { changes: [] })
        })
        return undefined
      },
    }

    return <FixQueryContext.Provider value={value}>{children}</FixQueryContext.Provider>
  },
  (prev, next) =>
    prev.searchQuery === next.searchQuery &&
    prev.history.changes.sort().join(',') === next.history.changes.sort().join(',') &&
    prev.history.after === next.history.after &&
    prev.history.before === next.history.before &&
    prev.onChange === next.onChange,
)
