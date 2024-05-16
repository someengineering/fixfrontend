import { useLingui } from '@lingui/react'
import { PropsWithChildren, createContext, memo } from 'react'
import { JsonElement, Query } from './query'

type CombineType = Query['combine']
type DeleteIsType = Query['delete_is']
type DeletePredicateType = Query['delete_predicate']
type SetIsType = Query['set_is']
type SetPredicateType = Query['set_predicate']
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
  // get methods
  findPaths: Query['find_paths']
  // update
  combine: CombineType
  deleteIs: DeleteIsType
  deletePredicate: DeletePredicateType
  setIs: (kinds: string[]) => Query
  setPredicate: (name: string, op: string, value: JsonElement) => Query
  updateFullTextSearch: UpdateFullTextType
  deleteMatching: Query['delete_matching']
  updateQuery: (q: string) => Query
  reset: () => Query
}

export const FixQueryContext = createContext<FixQueryContextValue | null>(null)

interface FixQueryProviderProps extends PropsWithChildren {
  searchQuery?: string
  onChange: (searchQuery: string) => void
}

export const FixQueryProvider = memo(
  ({ searchQuery, onChange, children }: FixQueryProviderProps) => {
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
      setIs: forceUpdateAndCall<Parameters<SetIsType>>(query.set_is.bind(query)),
      setPredicate: forceUpdateAndCall<Parameters<SetPredicateType>>(query.set_predicate.bind(query)),
      updateFullTextSearch: forceUpdateAndCall<Parameters<UpdateFullTextType>>(query.update_fulltext.bind(query)),
      deleteMatching: query.delete_matching.bind(query),
      updateQuery: (q: string) => {
        if (query.toString() !== (q || 'all')) {
          const newQuery = Query.parse(q || 'all')
          const result = query.toString()
          onChange(result)
          return newQuery
        } else {
          return query
        }
      },
      reset: () => {
        const query = Query.parse('all')
        onChange('all')
        return query
      },
    }

    return <FixQueryContext.Provider value={value}>{children}</FixQueryContext.Provider>
  },
  (prev, next) => prev.searchQuery === next.searchQuery && prev.onChange === next.onChange,
)
