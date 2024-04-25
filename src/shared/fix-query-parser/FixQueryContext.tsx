import { MutableRefObject, PropsWithChildren, createContext, useMemo, useRef, useState } from 'react'
import { JsonElement, Query } from './query'

type CombineType = Query['combine']
type DeleteIsType = Query['delete_is']
type DeletePredicateType = Query['delete_predicate']
type SetIsType = Query['set_is']
type SetPredicateType = Query['set_predicate']
type UpdateFullTextType = Query['update_fulltext']

export type FixQueryContextValue = {
  error: Error | undefined
  query: Query
  account: Query['account']
  cloud: Query['cloud']
  fullTextSearches: Query['fullTextSearches']
  parts: Query['parts']
  region: Query['region']
  severity: Query['severity']
  tags: Query['tags']
  aggregate: Query['aggregate']
  sorts: Query['sorts']
  is: Query['is']
  predicates: Query['predicates']
  fullTexts: Query['fulltexts']
  provides_security_check_details: Query['provides_security_check_details']
  findPaths: Query['find_paths']
  update: MutableRefObject<{
    combine: CombineType
    deleteIs: DeleteIsType
    deletePredicate: DeletePredicateType
    setIs: (kinds: string[]) => Query
    setPredicate: (name: string, op: string, value: JsonElement) => Query
    updateFullTextSearch: UpdateFullTextType
    deleteMatching: Query['delete_matching']
    updateQuery: (q: string) => Query
    reset: () => Query
  }>
  q: string
}

export const FixQueryContext = createContext<FixQueryContextValue | null>(null)

interface FixQueryProviderProps extends PropsWithChildren {
  searchQuery?: string
}

export const FixQueryProvider = ({ searchQuery, children }: FixQueryProviderProps) => {
  const [error, setError] = useState<Error>()
  const [query, setQuery] = useState(() => {
    try {
      return Query.parse(searchQuery ?? 'all')
    } catch (e) {
      return Query.parse('all')
    }
  })

  function forceUpdateAndCall<Args extends unknown[]>(fn: (...args: Args) => Query) {
    return (...params: Args) => {
      try {
        let result = fn(...params)
        result = result.delete_all_term_if_any()
        setError(undefined)
        setQuery(result)
        return result
      } catch (e) {
        setError(e as Error)
        throw e
      }
    }
  }

  const update = useRef<FixQueryContextValue['update']['current']>({
    combine: forceUpdateAndCall<Parameters<CombineType>>(query.combine.bind(query)),
    deleteIs: forceUpdateAndCall<Parameters<DeleteIsType>>(query.delete_is.bind(query)),
    deletePredicate: forceUpdateAndCall<Parameters<DeletePredicateType>>(query.delete_predicate.bind(query)),
    setIs: forceUpdateAndCall<Parameters<SetIsType>>(query.set_is.bind(query)),
    setPredicate: forceUpdateAndCall<Parameters<SetPredicateType>>(query.set_predicate.bind(query)),
    updateFullTextSearch: forceUpdateAndCall<Parameters<UpdateFullTextType>>(query.update_fulltext.bind(query)),
    deleteMatching: query.delete_matching.bind(query),
    updateQuery: (q: string) => {
      try {
        if (query.toString() !== (q || 'all')) {
          const newQuery = Query.parse(q || 'all')
          setError(undefined)
          setQuery(newQuery)
          return newQuery
        } else {
          return query
        }
      } catch (e) {
        setError(e as Error)
        throw e
      }
    },
    reset: () => {
      const query = Query.parse('all')
      setError(undefined)
      setQuery(query)
      return query
    },
  })
  const value = useMemo(() => {
    const { account, cloud, fullTextSearches, parts, region, severity, tags, aggregate, sorts } = query
    update.current = {
      combine: forceUpdateAndCall<Parameters<CombineType>>(query.combine.bind(query)),
      deleteIs: forceUpdateAndCall<Parameters<DeleteIsType>>(query.delete_is.bind(query)),
      deletePredicate: forceUpdateAndCall<Parameters<DeletePredicateType>>(query.delete_predicate.bind(query)),
      setIs: forceUpdateAndCall<Parameters<SetIsType>>(query.set_is.bind(query)),
      setPredicate: forceUpdateAndCall<Parameters<SetPredicateType>>(query.set_predicate.bind(query)),
      updateFullTextSearch: forceUpdateAndCall<Parameters<UpdateFullTextType>>(query.update_fulltext.bind(query)),
      deleteMatching: query.delete_matching.bind(query),
      updateQuery: update.current.updateQuery,
      reset: update.current.reset,
    }
    return {
      error,
      query,
      account,
      cloud,
      fullTextSearches,
      parts,
      region,
      severity,
      tags,
      aggregate,
      update,
      sorts,
      q: query.toString(),
      is: query.is.bind(query),
      predicates: query.predicates.bind(query),
      provides_security_check_details: query.provides_security_check_details.bind(query),
      fullTexts: query.fulltexts.bind(query),
      findPaths: query.find_paths.bind(query),
    }
  }, [error, query])
  return <FixQueryContext.Provider value={value}>{children}</FixQueryContext.Provider>
}
