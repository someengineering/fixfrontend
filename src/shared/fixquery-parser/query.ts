import { immerable, produce } from 'immer'
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
  [immerable] = true

  find_terms(fn: (term: Term) => boolean, wdf: (wd: Term) => boolean = (_) => true): Term[] {
    if (fn(this)) {
      return [this]
    } else if (this instanceof CombinedTerm && wdf(this)) {
      return this.left.find_terms(fn, wdf).concat(this.right.find_terms(fn, wdf))
    } else if (this instanceof NotTerm && wdf(this)) {
      return this.term.find_terms(fn, wdf)
    } else if (this instanceof ContextTerm && wdf(this)) {
      return this.term.find_terms(fn, wdf)
    } else if (this instanceof MergeTerm && wdf(this)) {
      return this.preFilter
        .find_terms(fn, wdf)
        .concat(this.merge.flatMap((q) => q.query.parts.flatMap((p) => p.term.find_terms(fn, wdf))))
        .concat(this.postFilter?.find_terms(fn, wdf) || [])
    }
    return []
  }

  delete_terms(fn: (term: Term) => boolean, wdf: (wd: Term) => boolean = (_) => true): Term {
    if (fn(this)) {
      return new AllTerm()
    } else if (this instanceof CombinedTerm && wdf(this)) {
      const in_left = this.left.find_terms(fn, wdf)
      const in_right = this.right.find_terms(fn, wdf)
      const left = in_left.length > 0 ? this.left.delete_terms(fn, wdf) : this.left
      const right = in_right.length > 0 ? this.right.delete_terms(fn, wdf) : this.right
      if (in_left.length > 0 || in_right.length > 0) {
        if (left instanceof AllTerm && right instanceof AllTerm) {
          return new AllTerm()
        } else if (left instanceof AllTerm) {
          return right
        } else if (right instanceof AllTerm) {
          return left
        } else {
          return new CombinedTerm({ left, op: this.op, right })
        }
      }
    }
    return this
  }

  abstract toString(): string
}

export class AllTerm extends Term {
  toString(): string {
    return 'all'
  }
}

export class NotTerm extends Term {
  term: Term

  constructor({ term }: { term: Term }) {
    super()
    this.term = term
  }

  toString(): string {
    return `not ${this.term.toString()}`
  }
}

export class FulltextTerm extends Term {
  text: string

  constructor({ text }: { text: string }) {
    super()
    this.text = text
  }

  toString(): string {
    return `"${this.text}"`
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

  toString(): string {
    const modifier = this.args?.filter?.toString() || ''
    return `${this.name} ${modifier}${this.op} ${JSON.stringify(this.value)}`
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

  toString(): string {
    return `${this.name}.{${this.term.toString()}}`
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

  toString(): string {
    const same_op = (t: Term): boolean => !(t instanceof CombinedTerm) || t.op === this.op
    if (same_op(this.left) && same_op(this.right)) {
      return `${this.left.toString()} ${this.op} ${this.right.toString()}`
    } else if (!same_op(this.left) && !same_op(this.right)) {
      return `(${this.left.toString()}) ${this.op} (${this.right.toString()})`
    } else if (!same_op(this.left)) {
      return `(${this.left.toString()}) ${this.op} ${this.right.toString()}`
    } else {
      return `${this.left.toString()} ${this.op} (${this.right.toString()})`
    }
  }
}

export class IdTerm extends Term {
  ids: string[]

  constructor({ ids }: { ids: string[] }) {
    super()
    this.ids = ids
  }
  toString(): string {
    return `id(${this.ids.join(', ')})`
  }
}

export class IsTerm extends Term {
  kinds: string[]

  constructor({ kinds }: { kinds: string[] }) {
    super()
    this.kinds = kinds
  }

  toString(): string {
    return `is(${this.kinds.join(', ')})`
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

  toString(): string {
    const args = this.args.join(', ')
    const sep = args.length > 0 ? ', ' : ''
    return `${this.fn}(${this.propertyPath}${sep}${args})`
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

  toString(): string {
    const arr = this.onlyFirst ? '' : '[]'
    return `${this.name}${arr}: ${this.query.toString()}`
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

  toString(): string {
    const merge = this.merge.join(', ')
    const post = this.postFilter ? ' ' + this.postFilter.toString() : ''
    return `${this.preFilter.toString()} {${merge}}${post}`
  }
}

export class WithClauseFilter {
  op: string
  num: number

  constructor({ op, num }: { op: string; num: number }) {
    this.op = op
    this.num = num
  }

  toString(): string {
    if (this.op === '==' && this.num === 0) {
      return `empty`
    } else if (this.op === '>' && this.num === 0) {
      return `any`
    } else {
      return `count${this.op}${this.num}`
    }
  }
}

export class WithClause {
  [immerable] = true

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

  toString(): string {
    const term = this.term ? ` ${this.term.toString()}` : ''
    const with_clause = this.with_clause ? ` ${this.with_clause.toString()}` : ''
    return `with(${this.with_filter.toString()}, ${this.navigation.toString()}${term}${with_clause})`
  }
}

export class Navigation {
  [immerable] = true

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

  toString(): string {
    const same = this.start == this.until
    const mo = this.maybe_two_directional_outbound_edge_type
    let depth: string
    if (same && this.start == 1 && mo == undefined) {
      depth = ''
    } else if (same && mo == undefined) {
      depth = `[${this.start}]`
    } else {
      depth = `[${this.start}:${this.until ? this.until : ''}]`
    }
    const et = this.edge_types ? this.edge_types.join(',') : ''
    const out_nav = mo ? `(${mo.join(',')})` : ''
    const nav = `${et}${depth}${out_nav}`
    if (this.direction === Direction.inbound) {
      return `<-${nav}-`
    } else if (this.direction === Direction.outbound) {
      return `-${nav}->`
    } else {
      return `<-${nav}->`
    }
  }
}

export class Limit {
  [immerable] = true
  offset: number
  length: number

  constructor({ offset, length }: { offset?: number; length: number }) {
    this.offset = offset || 0
    this.length = length
  }

  toString(): string {
    const offset = this.offset > 0 ? `${this.offset}, ` : ''
    return `limit ${offset}${this.length}`
  }
}

export class Sort {
  [immerable] = true
  name: string
  order: SortOrder = SortOrder.Asc

  constructor({ name, order = SortOrder.Asc }: { name: string; order?: SortOrder }) {
    this.name = name
    this.order = order
  }

  toString(): string {
    return `${this.name} ${this.order}`
  }
}

export class Part {
  [immerable] = true
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

  toString(): string {
    const with_clause = this.with_clause ? ` ${this.with_clause.toString()}` : ''
    const sort = this.sort.length > 0 ? `sort ${this.sort.map((s) => s.toString()).join(', ')}` : ''
    const limit = this.limit ? ` ${this.limit.toString()}` : ''
    const nav = this.navigation ? ` ${this.navigation.toString()}` : ''
    return `${this.term.toString()}${with_clause}${sort}${limit}${nav}`
  }
}

interface Aggregate {
  // Define the properties of Aggregate here
  toString(): string
}

const CloudIdentifier = new Set(['/ancestors.cloud.reported.id', '/ancestors.cloud.reported.name'])
const AccountIdentifier = new Set(['/ancestors.account.reported.id', '/ancestors.account.reported.name'])
const RegionIdentifier = new Set(['/ancestors.region.reported.id', '/ancestors.region.reported.name'])
export class Query {
  [immerable] = true
  parts: Part[]
  preamble: Record<string, SimpleValue>
  aggregate?: Aggregate

  constructor({ parts, preamble = {}, aggregate }: { parts: Part[]; preamble?: Record<string, SimpleValue>; aggregate?: Aggregate }) {
    this.parts = parts
    this.preamble = preamble
    this.aggregate = aggregate
  }

  toString(): string {
    const aggregate = this.aggregate ? this.aggregate.toString() : ''
    const pre = Object.entries(this.preamble)
    const colon = pre.length > 0 || this.aggregate != undefined ? ':' : ''
    const preamble = pre.length > 0 ? '(' + pre.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ') + ')' : ''
    const parts = this.parts.map((p) => p.toString()).join(' ')
    return `${aggregate}${preamble}${colon}${parts}`
  }

  public get working_part(): Part {
    // Using the UI, we can only access and modify predicates of the last part.
    if (this.parts.length === 0) {
      throw new Error('Query has no parts')
    }
    return this.parts[this.parts.length - 1]
  }

  public is(): IsTerm | undefined {
    // The UI assumes that all parts are AND combined. Do not walk OR parts.
    const only_and_parts = (wd: Term) => !(wd instanceof CombinedTerm) || wd.op === 'and'
    const is_terms = this.working_part.term.find_terms((t) => t instanceof IsTerm, only_and_parts) as IsTerm[]
    return is_terms.length > 0 ? is_terms[0] : undefined
  }

  public predicates(): Predicate[] {
    // The UI assumes that all parts are AND combined. Do not walk OR parts.
    const only_and_parts = (wd: Term) => !(wd instanceof CombinedTerm) || wd.op === 'and'
    return this.working_part.term.find_terms((t) => t instanceof Predicate, only_and_parts) as Predicate[]
  }

  public get remaining_predicates(): Record<string, JsonElement> {
    // neither cloud, account, region, tags nor severity
    return this.predicates()
      .filter((p) => !p.name.startsWith('/ancestors.') && !p.name.startsWith('/security.severity') && !p.name.startsWith('tags'))
      .reduce((acc, pred) => ({ ...acc, [pred.name]: pred.value }), {} as { [key: string]: JsonElement })
  }

  public get cloud(): Predicate | undefined {
    return this.predicates().find((p) => CloudIdentifier.has(p.name))
  }

  public get account(): Predicate | undefined {
    return this.predicates().find((p) => AccountIdentifier.has(p.name))
  }

  public get region(): Predicate | undefined {
    return this.predicates().find((p) => RegionIdentifier.has(p.name))
  }

  public set_predicate(name: string, op: string, value: JsonElement): Query {
    return produce(this, (draft) => {
      const existing = draft.predicates().find((p) => p.name == name)
      if (existing) {
        existing.op = op
        existing.value = value
      } else {
        draft.working_part.term = new CombinedTerm({
          left: new Predicate({ name, op, value }),
          op: 'and',
          right: draft.working_part.term,
        })
      }
    })
  }
  public delete_predicate(name: string): Query {
    return produce(this, (draft) => {
      const existing = this.predicates().find((p) => p.name == name)
      if (existing) {
        draft.working_part.term = this.working_part.term.delete_terms((t) => existing === t)
      }
    })
  }

  public set_is(kinds: string[]): Query {
    return produce(this, (draft) => {
      const existing = draft.is()
      if (existing) {
        existing.kinds = kinds
      } else {
        draft.working_part.term = new CombinedTerm({
          left: new IsTerm({ kinds }),
          op: 'and',
          right: draft.working_part.term,
        })
      }
    })
  }

  public delete_is(): Query {
    return produce(this, (draft) => {
      const existing = this.is()
      if (existing) {
        draft.working_part.term = this.working_part.term.delete_terms((t) => existing === t)
      }
    })
  }

  public get tags(): Record<string, JsonElement> {
    return this.predicates()
      .filter((p) => p.name.startsWith('tags'))
      .reduce((acc, pred) => ({ ...acc, [pred.name]: pred.value }), {} as { [key: string]: JsonElement })
  }

  public get severity(): Predicate | undefined {
    return this.predicates().find((p) => p.name == '/security.severity')
  }

  static parse(query: string): Query {
    return parse_query(query)
  }
}
