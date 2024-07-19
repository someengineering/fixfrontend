import { useLingui } from '@lingui/react'
import { PropsWithChildren, createContext, memo } from 'react'
import { WorkspaceInventorySearchTableHistory, WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'
import { JsonElement, Query } from './query'

type ReturnTypeWithUndefined<T> = T extends (...args: infer Args) => unknown ? (...args: Args) => ReturnType<T> | undefined : never

type CombineType = Query['combine']
type DeleteIsType = Query['delete_is']
type DeletePredicateType = Query['delete_predicate']
type DeleteCloudAccountRegionType = Query['delete_cloud_account_region']
type SetIsType = Query['set_is']
type SetPredicateType = Query['set_predicate']
type SetCloudAccountRegionType = Query['set_cloud_account_region']
type UpdateFullTextType = Query['update_fulltext']

export type FixQueryContextValue = {
  // default variables
  error?: Error
  query: Query | undefined
  account?: Query['account']
  cloud?: Query['cloud']
  parts?: Query['parts']
  region?: Query['region']
  severity?: Query['severity']
  tags: Query['tags']
  aggregate?: Query['aggregate']
  sorts: Query['sorts']
  // get
  fullTextSearches: ReturnType<Query['fulltexts']>
  is: ReturnType<Query['is']>
  q: string
  predicates: ReturnType<Query['predicates']>
  provides_security_check_details: ReturnType<Query['provides_security_check_details']>
  uiSimpleQuery: ReturnType<Query['ui_simple_query']>
  history: WorkspaceInventorySearchTableHistory
  // get methods
  findPaths: Query['find_paths']
  // update
  combine: ReturnTypeWithUndefined<CombineType>
  deleteIs: ReturnTypeWithUndefined<DeleteIsType>
  deletePredicate: ReturnTypeWithUndefined<DeletePredicateType>
  deleteCloudAccountRegion: ReturnTypeWithUndefined<DeleteCloudAccountRegionType>
  setIs: (kinds: string[]) => Query | undefined
  setPredicate: (name: string, op: string, value: JsonElement) => Query | undefined
  setCloudAccountRegion: (name: 'cloud' | 'account' | 'region', op: string, value: JsonElement, useName?: boolean) => Query | undefined
  changeCloudAccountRegionFromIdToName: (name: 'cloud' | 'account' | 'region', newValue: JsonElement, op?: string) => Query | undefined
  updateFullTextSearch: ReturnTypeWithUndefined<UpdateFullTextType>
  deleteMatching: Query['delete_matching']
  updateQuery: (q: string) => Query | undefined
  onHistoryChange: (history?: WorkspaceInventorySearchTableHistory) => void
  reset: () => Query | undefined
}

export const FixQueryContext = createContext<FixQueryContextValue | null>(null)

interface FixQueryProviderProps extends PropsWithChildren {
  searchQuery?: string
  withHistory?: boolean
  history: WorkspaceInventorySearchTableHistory
  allHistory?: readonly WorkspaceInventorySearchTableHistoryChanges[]
  onHistoryChange: (history?: WorkspaceInventorySearchTableHistory) => void
  onChange: (searchQuery?: string) => void
}

export const FixQueryProvider = memo(
  ({ searchQuery, onChange, withHistory, history, onHistoryChange, allHistory = [], children }: FixQueryProviderProps) => {
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
        if (result === 'all') {
          onChange('')
          return undefined
        }
        if (withHistory && !history.changes.length) {
          onHistoryChange({ changes: [...allHistory] })
        }
        onChange(result)
        return query
      }
    }

    const { account, cloud, parts = [], region, severity, tags = {}, aggregate, sorts = [] } = query || {}
    const value = {
      // history
      history,
      onHistoryChange,
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
        onChange(result)
        return newQuery
      },
      updateQuery: (q: string) => {
        if ((query?.toString() ?? '') !== q) {
          const newQuery = q ? Query.parse(q) : undefined
          const result = newQuery?.toString() ?? ''
          window.setTimeout(() => {
            onChange(result)
          })
          return newQuery
        } else {
          return query
        }
      },
      reset: () => {
        window.setTimeout(() => {
          onChange('')
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
    prev.onChange === next.onChange &&
    prev.onHistoryChange === next.onHistoryChange,
)
