import { createContext } from 'react'
import { WorkspaceInventorySearchTableHistory } from 'src/shared/types/server'
import { JsonElement, Query } from './query'

export type ReturnTypeWithUndefined<T> = T extends (...args: infer Args) => unknown ? (...args: Args) => ReturnType<T> | undefined : never

export type CombineType = Query['combine']
export type DeleteIsType = Query['delete_is']
export type DeletePredicateType = Query['delete_predicate']
export type DeleteCloudAccountRegionType = Query['delete_cloud_account_region']
export type SetIsType = Query['set_is']
export type SetPredicateType = Query['set_predicate']
export type SetCloudAccountRegionType = Query['set_cloud_account_region']
export type UpdateFullTextType = Query['update_fulltext']

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
