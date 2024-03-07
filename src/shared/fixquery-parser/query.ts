import { parse_query } from './parser.ts'

export type SimpleValue = string | number | boolean | null
export type JsonElement = SimpleValue | { [key in string]: JsonElement } | JsonElement[]

export enum SortOrder {
  Asc = 'Asc',
  Desc = 'Desc',
}

export enum Direction {
  outbound = 'outbound',
  inbound = 'in',
  any = 'any',
}

export enum EdgeType {
  default = 'default',
  delete = 'delete',
}

export abstract class Term {
  find_terms(fn: (term: Term) => boolean): Term[] {
    if (fn(this)) {
      return [this]
    } else if (this instanceof CombinedTerm) {
      return this.left.find_terms(fn).concat(this.right.find_terms(fn))
    } else if (this instanceof NotTerm) {
      return this.term.find_terms(fn)
    } else if (this instanceof ContextTerm) {
      return this.term.find_terms(fn)
    } else if (this instanceof MergeTerm) {
      return this.preFilter
        .find_terms(fn)
        .concat(this.merge.flatMap((q) => q.query.parts.flatMap((p) => p.term.find_terms(fn))))
        .concat(this.postFilter?.find_terms(fn) || [])
    }
    return []
  }
}

export class AllTerm extends Term {}

export class NotTerm extends Term {
  term: Term

  constructor({ term }: { term: Term }) {
    super()
    this.term = term
  }
}

export class FulltextTerm extends Term {
  text: string

  constructor({ text }: { text: string }) {
    super()
    this.text = text
  }
}

export class Predicate extends Term {
  name: string
  op: string
  value: JsonElement
  args: Record<string, JsonElement>

  constructor({
    name,
    op,
    value,
    args = {},
  }: {
    name: string
    op: string
    value: JsonElement
    args?: Record<string, JsonElement> | undefined
  }) {
    super()
    this.name = name
    this.op = op
    this.value = value
    this.args = args || {}
  }
}

export class ContextTerm extends Term {
  name: string
  term: Term

  constructor({ name, term }: { name: string; term: Term }) {
    super()
    this.name = name
    this.term = term
  }
}

export class CombinedTerm extends Term {
  left: Term
  op: string
  right: Term

  constructor({ left, op, right }: { left: Term; op: string; right: Term }) {
    super()
    this.left = left
    this.op = op
    this.right = right
  }
}

export class IdTerm extends Term {
  ids: string[]

  constructor({ ids }: { ids: string[] }) {
    super()
    this.ids = ids
  }
}

export class IsTerm extends Term {
  kinds: string[]

  constructor({ kinds }: { kinds: string[] }) {
    super()
    this.kinds = kinds
  }
}

export class FunctionTerm extends Term {
  fn: string
  propertyPath: string
  args: Array<JsonElement>

  constructor({ fn, propertyPath, args }: { fn: string; propertyPath: string; args: Array<JsonElement> }) {
    super()
    this.fn = fn
    this.propertyPath = propertyPath
    this.args = args
  }
}

export class MergeQuery {
  name: string
  query: Query
  onlyFirst: boolean

  constructor({ name, query, onlyFirst }: { name: string; query: Query; onlyFirst?: boolean }) {
    this.name = name
    this.query = query
    this.onlyFirst = onlyFirst || true
  }
}

export class MergeTerm extends Term {
  preFilter: Term
  merge: MergeQuery[]
  postFilter?: Term

  constructor({ preFilter, merge, postFilter }: { preFilter: Term; merge: MergeQuery[]; postFilter?: Term }) {
    super()
    this.preFilter = preFilter
    this.merge = merge
    this.postFilter = postFilter
  }
}

export class WithClauseFilter {
  op: string
  num: number

  constructor({ op, num }: { op: string; num: number }) {
    this.op = op
    this.num = num
  }
}

export class WithClause {
  with_filter: WithClauseFilter
  navigation: Navigation
  term: Term | undefined
  with_clause: WithClause | undefined

  constructor({
    with_filter,
    navigation,
    term,
    with_clause,
  }: {
    with_filter: WithClauseFilter
    navigation: Navigation
    term?: Term | undefined
    with_clause?: WithClause | undefined
  }) {
    this.with_filter = with_filter
    this.navigation = navigation
    this.term = term
    this.with_clause = with_clause
  }
}

export class Navigation {
  static Max: number = 250
  start: number
  until: number | undefined
  edge_types: EdgeType[] | undefined
  direction: Direction
  maybe_two_directional_outbound_edge_type: EdgeType[] | null

  constructor({
    start = 1,
    until = 1,
    edge_types = [EdgeType.default],
    direction = Direction.outbound,
    maybe_two_directional_outbound_edge_type = null,
  }: {
    start?: number
    until?: number
    edge_types?: EdgeType[]
    direction?: Direction
    maybe_two_directional_outbound_edge_type?: EdgeType[] | null
  } = {}) {
    this.start = start
    this.until = until
    this.edge_types = edge_types
    this.direction = direction
    this.maybe_two_directional_outbound_edge_type = maybe_two_directional_outbound_edge_type
  }
}

export class Limit {
  offset: number
  length: number

  constructor({ offset, length }: { offset?: number; length: number }) {
    this.offset = offset || 0
    this.length = length
  }
}

export class Sort {
  name: string
  order: SortOrder = SortOrder.Asc

  constructor({ name, order = SortOrder.Asc }: { name: string; order?: SortOrder }) {
    this.name = name
    this.order = order
  }
}

export class Part {
  term: Term
  with_clause: WithClause | undefined
  sort: Sort[]
  limit?: Limit
  navigation?: Navigation

  constructor({
    term,
    with_clause,
    sort = [],
    limit,
    navigation,
  }: {
    term: Term
    with_clause?: WithClause
    sort?: Sort[]
    limit?: Limit
    navigation?: Navigation
  }) {
    this.term = term
    this.with_clause = with_clause
    this.sort = sort
    this.limit = limit
    this.navigation = navigation
  }
}

interface Aggregate {
  // Define the properties of Aggregate here
}

export class Query {
  parts: Part[]
  preamble: Record<string, SimpleValue>
  aggregate?: Aggregate

  constructor({ parts, preamble = {}, aggregate }: { parts: Part[]; preamble?: Record<string, SimpleValue>; aggregate?: Aggregate }) {
    this.parts = parts
    this.preamble = preamble
    this.aggregate = aggregate
  }

  public predicates(): Predicate[] {
    return this.parts.flatMap((p) => p.term.find_terms((t) => t instanceof Predicate) as Predicate[])
  }

  public get remaining_predicates(): Record<string, JsonElement> {
    // neither cloud, account, region, tags nor severity
    return this.predicates()
      .filter((p) => !p.name.startsWith('/ancestors.') && !p.name.startsWith('/security.severity') && !p.name.startsWith('tags'))
      .reduce((acc, pred) => ({ ...acc, [pred.name]: pred.value }), {} as { [key: string]: JsonElement })
  }

  public get cloud(): Predicate | undefined {
    return this.predicates().find((p) => p.name.startsWith('/ancestors.cloud.reported'))
  }

  public get account(): Predicate | undefined {
    return this.predicates().find((p) => p.name.startsWith('/ancestors.account.reported'))
  }

  public get region(): Predicate | undefined {
    return this.predicates().find((p) => p.name.startsWith('/ancestors.cloud.reported'))
  }

  public get tags(): Record<string, JsonElement> {
    return this.predicates()
      .filter((p) => p.name.startsWith('tags'))
      .reduce((acc, pred) => ({ ...acc, [pred.name]: pred.value }), {} as { [key: string]: JsonElement })
  }

  public get severity(): Predicate | undefined {
    return this.predicates().find((p) => p.name.startsWith('/security.severity'))
  }

  static parse(query: string): Query {
    return parse_query(query)
  }
}
