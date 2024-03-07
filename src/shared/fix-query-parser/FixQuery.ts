import { fixQueryParser } from './fixQueryParser.ts'

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
  findTerms(fn: (term: Term) => boolean): Term[] {
    if (fn(this)) {
      return [this]
    } else if (this instanceof CombinedTerm) {
      return this.left.findTerms(fn).concat(this.right.findTerms(fn))
    } else if (this instanceof NotTerm) {
      return this.term.findTerms(fn)
    } else if (this instanceof ContextTerm) {
      return this.term.findTerms(fn)
    } else if (this instanceof MergeTerm) {
      return this.preFilter
        .findTerms(fn)
        .concat(this.merge.flatMap((q) => q.query.parts.flatMap((p) => p.term.findTerms(fn))))
        .concat(this.postFilter?.findTerms(fn) || [])
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

export class FullTextTerm extends Term {
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
  query: FixQuery
  onlyFirst: boolean

  constructor({ name, query, onlyFirst }: { name: string; query: FixQuery; onlyFirst?: boolean }) {
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
  withFilter: WithClauseFilter
  navigation: Navigation
  term: Term | undefined
  withClause: WithClause | undefined

  constructor({
    withFilter,
    navigation,
    term,
    withClause,
  }: {
    withFilter: WithClauseFilter
    navigation: Navigation
    term?: Term | undefined
    withClause?: WithClause | undefined
  }) {
    this.withFilter = withFilter
    this.navigation = navigation
    this.term = term
    this.withClause = withClause
  }
}

export class Navigation {
  static Max: number = 250
  start: number
  until: number | undefined
  edgeTypes: EdgeType[] | undefined
  direction: Direction
  maybeTwoDirectionalOutboundEdgeType: EdgeType[] | null

  constructor({
    start = 1,
    until = 1,
    edgeTypes = [EdgeType.default],
    direction = Direction.outbound,
    maybeTwoDirectionalOutboundEdgeType = null,
  }: {
    start?: number
    until?: number
    edgeTypes?: EdgeType[]
    direction?: Direction
    maybeTwoDirectionalOutboundEdgeType?: EdgeType[] | null
  } = {}) {
    this.start = start
    this.until = until
    this.edgeTypes = edgeTypes
    this.direction = direction
    this.maybeTwoDirectionalOutboundEdgeType = maybeTwoDirectionalOutboundEdgeType
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
  withClause: WithClause | undefined
  sort: Sort[]
  limit?: Limit
  navigation?: Navigation

  constructor({
    term,
    withClause,
    sort = [],
    limit,
    navigation,
  }: {
    term: Term
    withClause?: WithClause
    sort?: Sort[]
    limit?: Limit
    navigation?: Navigation
  }) {
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

export class FixQuery {
  parts: Part[]
  preamble: Record<string, SimpleValue>
  aggregate?: Aggregate

  constructor({ parts, preamble = {}, aggregate }: { parts: Part[]; preamble?: Record<string, SimpleValue>; aggregate?: Aggregate }) {
    this.parts = parts
    this.preamble = preamble
    this.aggregate = aggregate
  }

  public predicates(): Predicate[] {
    return this.parts.flatMap((p) => p.term.findTerms((t) => t instanceof Predicate) as Predicate[])
  }

  public get remainingPredicates(): Record<string, JsonElement> {
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

  static parse(query: string): FixQuery {
    return fixQueryParser(query)
  }
}
