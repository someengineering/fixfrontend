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

export abstract class Term {}

export class AllTerm extends Term {}

export class NotTerm extends Term {
  term: Term

  constructor(term: Term) {
    super()
    this.term = term
  }
}

export class FulltextTerm extends Term {
  text: string

  constructor(text: string) {
    super()
    this.text = text
  }
}

export class Predicate extends Term {
  name: string
  op: string
  value: JsonElement
  args: Record<string, JsonElement>

  constructor(name: string, op: string, value: JsonElement, args: Record<string, JsonElement>) {
    super()
    this.name = name
    this.op = op
    this.value = value
    this.args = args
  }
}

export class ContextTerm extends Term {
  name: string
  term: Term

  constructor(name: string, term: Term) {
    super()
    this.name = name
    this.term = term
  }
}

export class CombinedTerm extends Term {
  left: Term
  op: string
  right: Term

  constructor(left: Term, op: string, right: Term) {
    super()
    this.left = left
    this.op = op
    this.right = right
  }
}

export class IdTerm extends Term {
  ids: string[]

  constructor(ids: string[]) {
    super()
    this.ids = ids
  }
}

export class IsTerm extends Term {
  kinds: string[]

  constructor(kinds: string[]) {
    super()
    this.kinds = kinds
  }
}

export class FunctionTerm extends Term {
  fn: string
  propertyPath: string
  args: Array<JsonElement>

  constructor(fn: string, propertyPath: string, args: Array<JsonElement>) {
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

  constructor(name: string, query: Query, onlyFirst: boolean) {
    this.name = name
    this.query = query
    this.onlyFirst = onlyFirst
  }
}

export class MergeTerm extends Term {
  preFilter: Term
  merge: MergeQuery[]
  postFilter?: Term

  constructor(preFilter: Term, merge: MergeQuery[], postFilter?: Term) {
    super()
    this.preFilter = preFilter
    this.merge = merge
    this.postFilter = postFilter
  }
}

export class WithClauseFilter {
  op: string
  num: number
  constructor(op: string, num: number) {
    this.op = op
    this.num = num
  }
}

export class WithClause {
  with_filter: WithClauseFilter
  navigation: Navigation
  term: Term | null = null
  with_clause: WithClause | null = null
  constructor(with_filter: WithClauseFilter, navigation: Navigation, term: Term | null = null, with_clause: WithClause | null = null) {
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
  edge_types: EdgeType[] | null
  direction: Direction
  maybe_two_directional_outbound_edge_type: EdgeType[] | null

  constructor(
    start: number = 1,
    until: number | undefined = 1,
    edge_types: EdgeType[] = [EdgeType.default],
    direction: Direction = Direction.outbound,
    maybe_two_directional_outbound_edge_type: EdgeType[] | null = null,
  ) {
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
  constructor(offset: number, length: number) {
    this.offset = offset
    this.length = length
  }
}

export class Sort {
  name: string
  order: SortOrder = SortOrder.Asc
  constructor(name: string, order: SortOrder = SortOrder.Asc) {
    this.name = name
    this.order = order
  }
}
export class Part {
  term: Term
  withClause?: WithClause
  sort: Sort[]
  limit?: Limit
  navigation?: Navigation

  constructor(term: Term, withClause?: WithClause, sort: Sort[] = [], limit?: Limit, navigation?: Navigation) {
    this.term = term
    this.withClause = withClause
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

  constructor(parts: Part[], preamble: Record<string, SimpleValue> = {}, aggregate?: Aggregate) {
    this.parts = parts
    this.preamble = preamble
    this.aggregate = aggregate
  }
}
