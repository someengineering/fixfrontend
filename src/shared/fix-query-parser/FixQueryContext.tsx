import { useLingui } from '@lingui/react'
import { PropsWithChildren, createContext, memo } from 'react'
import { WorkspaceInventorySearchTableHistory } from 'src/shared/types/server'
import { JsonElement, Query } from './query'

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
  error: Error | undefined
  query: Query
  account: Query['account']
  cloud: Query['cloud']
  parts: Query['parts']
  region: Query['region']
  severity: Query['severity']
  tags: Query['tags']
  aggregate: Query['aggregate']
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
  combine: CombineType
  deleteIs: DeleteIsType
  deletePredicate: DeletePredicateType
  deleteCloudAccountRegion: DeleteCloudAccountRegionType
  setIs: (kinds: string[]) => Query
  setPredicate: (name: string, op: string, value: JsonElement) => Query
  setCloudAccountRegion: (name: 'cloud' | 'account' | 'region', op: string, value: JsonElement, useName?: boolean) => Query
  changeCloudAccountRegionFromIdToName: (name: 'cloud' | 'account' | 'region', newValue: JsonElement, op?: string) => Query
  updateFullTextSearch: UpdateFullTextType
  deleteMatching: Query['delete_matching']
  updateQuery: (q: string) => Query
  onHistoryChange: (history?: WorkspaceInventorySearchTableHistory) => void
  reset: () => Query
}

export const FixQueryContext = createContext<FixQueryContextValue | null>(null)

interface FixQueryProviderProps extends PropsWithChildren {
  searchQuery?: string
  history: WorkspaceInventorySearchTableHistory
  onHistoryChange: (history?: WorkspaceInventorySearchTableHistory) => void
  onChange: (searchQuery?: string) => void
}

export const FixQueryProvider = memo(
  ({ searchQuery, onChange, history, onHistoryChange, children }: FixQueryProviderProps) => {
    useLingui()
    let query = Query.parse('all')
    let error: Error | undefined

    try {
      query = Query.parse(searchQuery || 'all')
    } catch (err) {
      error = err as Error
    }

    function forceUpdateAndCall<Args extends unknown[]>(fn: (...args: Args) => Query) {
      return (...params: Args) => {
        const query = fn(...params)
        const result = query.toString()
        onChange(result)
        return query
      }
    }

    const { account, cloud, parts, region, severity, tags, aggregate, sorts } = query
    const value = {
      //history
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
      fullTextSearches: query.fulltexts(),
      is: query.is(),
      q: query.toString(),
      predicates: query.predicates(),
      provides_security_check_details: query.provides_security_check_details(),
      uiSimpleQuery: query.ui_simple_query(),
      // get methods
      findPaths: query.find_paths.bind(query),
      // update
      combine: forceUpdateAndCall<Parameters<CombineType>>(query.combine.bind(query)),
      deleteIs: forceUpdateAndCall<Parameters<DeleteIsType>>(query.delete_is.bind(query)),
      deletePredicate: forceUpdateAndCall<Parameters<DeletePredicateType>>(query.delete_predicate.bind(query)),
      deleteCloudAccountRegion: forceUpdateAndCall<Parameters<DeleteCloudAccountRegionType>>(query.delete_cloud_account_region.bind(query)),
      setIs: forceUpdateAndCall<Parameters<SetIsType>>(query.set_is.bind(query)),
      setPredicate: forceUpdateAndCall<Parameters<SetPredicateType>>(query.set_predicate.bind(query)),
      setCloudAccountRegion: forceUpdateAndCall<Parameters<SetCloudAccountRegionType>>(query.set_cloud_account_region.bind(query)),
      updateFullTextSearch: forceUpdateAndCall<Parameters<UpdateFullTextType>>(query.update_fulltext.bind(query)),
      deleteMatching: query.delete_matching.bind(query),
      changeCloudAccountRegionFromIdToName: (name: 'cloud' | 'account' | 'region', newValue: JsonElement, op?: string) => {
        const prevPredicate = name === 'cloud' ? cloud : name === 'account' ? account : region
        const newQuery = query
          .delete_cloud_account_region(name)
          .set_cloud_account_region(name, op ?? prevPredicate?.op ?? 'in', newValue, true)
        const result = newQuery.toString()
        onChange(result)
        return newQuery
      },
      updateQuery: (q: string) => {
        if (query.toString() !== (q || 'all')) {
          const newQuery = Query.parse(q || 'all')
          const result = newQuery.toString()
          window.setTimeout(() => {
            onChange(result)
          })
          return newQuery
        } else {
          return query
        }
      },
      reset: () => {
        const query = Query.parse('all')
        window.setTimeout(() => {
          onChange('all')
        })
        return query
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
