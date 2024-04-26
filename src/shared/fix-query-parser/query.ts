import { createDraft, Draft, finishDraft, immerable, produce } from 'immer'
import { combineOptional } from 'src/shared/utils/optional.ts'
import { parse_path, parse_query } from './parser.ts'
import { render } from './templater.ts'

export type SimpleValue = string | number | boolean | null
export type JsonElement = SimpleValue | Record<string, unknown> | (SimpleValue | Record<string, unknown> | unknown[])[]

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
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

export class PathPart {
  [immerable] = true
  name: string
  array_access: string | number | undefined
  backtick: boolean

  constructor({ name, array_access, backtick }: { name: string; array_access?: string | number | undefined; backtick?: boolean }) {
    this.name = name
    this.array_access = array_access
    this.backtick = backtick || false
  }

  for_array(index: number): PathPart {
    return new PathPart({ name: this.name, array_access: index })
  }

  accepts(index: number): boolean {
    return this.array_access === '*' || this.array_access === index
  }

  equalTo(other: PathPart): boolean {
    // '*' is a wildcard for array access: foo[*] == foo[0], foo[1] ...
    return (
      this.name === other.name &&
      (this.array_access === other.array_access ||
        (this.array_access === '*' && typeof other.array_access === 'number') ||
        (typeof this.array_access === 'number' && other.array_access === '*'))
    )
  }

  toString(): string {
    const array = this.array_access != undefined ? `[${this.array_access}]` : ''
    const tick = this.backtick ? '`' : ''
    return `${tick}${this.name}${tick}${array}`
  }
}

export class JsonElementChange {
  elem: JsonElement
  path: Path
  deleted: boolean
  changed: boolean

  constructor(elem: JsonElement, path: Path) {
    this.elem = elem
    this.path = path
    this.deleted = false
    this.changed = false
  }

  public get(): JsonElement {
    return this.elem
  }

  public set(value: JsonElement): void {
    this.elem = value
    this.changed = true
    this.deleted = false
  }

  public delete(): void {
    this.elem = null
    this.changed = true
    this.deleted = true
  }
}

export class JsonElementDraft {
  value: Draft<object>

  constructor(value: JsonElement) {
    this.value = createDraft(value as object)
  }

  public get final_value(): JsonElement {
    return finishDraft(this.value) as JsonElement
  }

  public *find(path: Path, criteria: (js: JsonElement) => boolean = (_) => true): Generator<JsonElementChange> {
    function* walk_path(parts: PathPart[], at: number, js: JsonElement): Generator<JsonElementChange> {
      if (js != null && typeof js === 'object') {
        const jso: { [key: string]: JsonElement } = js as { [key: string]: JsonElement }
        const part = path.parts[at]
        const current = jso[part.name]
        if (at == path.parts.length - 1) {
          if (part.array_access != undefined && Array.isArray(current)) {
            const arr: JsonElement[] = []
            for (let i = 0; i < current.length; i++) {
              const je = current[i] as JsonElement
              if (!part.accepts(i)) {
                arr.push(je)
              } else if (criteria(je)) {
                const change = new JsonElementChange(je, new Path({ parts: [...parts, part.for_array(i)] }))
                yield change
                if (!change.deleted) arr.push(change.get())
              }
            }
            jso[part.name] = arr
          } else if (part.array_access != undefined) {
            // array access on non-array: ignore
          } else if (criteria(current)) {
            const change = new JsonElementChange(current, new Path({ parts: [...parts, part] }))
            yield change
            if (change.changed && change.deleted) delete jso[part.name]
            else if (change.changed) jso[part.name] = change.get()
          }
        } else {
          if (part.array_access != undefined && Array.isArray(current)) {
            for (let i = 0; i < current.length; i++) {
              const e = current[i] as JsonElement
              yield* walk_path([...parts, part.for_array(i)], at + 1, e)
            }
          } else if (typeof current === 'object') {
            yield* walk_path([...parts, part], at + 1, current)
          }
        }
      }
    }

    yield* walk_path([], 0, this.value as JsonElement)
  }
}

export class Path {
  [immerable] = true
  parts: PathPart[]
  root: boolean

  constructor({ parts, root }: { parts?: PathPart[]; root?: boolean }) {
    this.parts = parts || []
    this.root = root || false
  }

  public startsWith(part: string | string[] | Path, root: boolean = false): boolean {
    let parts: PathPart[]
    if (typeof part === 'string') {
      parts = [new PathPart({ name: part })]
    } else if (Array.isArray(part)) {
      parts = part.map((name) => new PathPart({ name }))
    } else {
      parts = part.parts
    }
    if (this.root !== root) {
      return false
    }
    if (parts.length > this.parts.length) {
      return false
    }
    return parts.every((part, i) => this.parts[i].equalTo(part))
  }

  public getPathAndProp(): [string, string] {
    const propParts = [...this.parts]
    const root = this.root ? '/' : ''
    const pathParts = propParts.splice(0, propParts.length - 1)
    return [root + pathParts.join('.'), propParts[0].toString()]
  }

  public equalTo(other: Path): boolean {
    return (
      this.root === other.root && this.parts.length === other.parts.length && this.parts.every((part, i) => part.equalTo(other.parts[i]))
    )
  }

  public *find(elem: JsonElement, criteria: (js: JsonElement) => boolean = (_) => true): Generator<[Path, JsonElement]> {
    const path = this as Path

    function* walk_path(parts: PathPart[], at: number, js: JsonElement): Generator<[Path, JsonElement]> {
      const part = path.parts[at]
      if (js != null && typeof js === 'object') {
        const jso: { [key: string]: JsonElement } = js as { [key: string]: JsonElement }
        const current = jso[part.name]
        if (at == path.parts.length - 1) {
          if (part.array_access != undefined && Array.isArray(current)) {
            for (let i = 0; i < current.length; i++) {
              const e = current[i] as JsonElement
              if (part.accepts(i) && criteria(e)) yield [new Path({ parts: [...parts, part.for_array(i)] }), e]
            }
          } else if (part.array_access != undefined) {
            // array access on non-array: ignore
          } else if (criteria(current)) {
            yield [new Path({ parts: [...parts, part] }), current]
          }
        } else {
          if (part.array_access != undefined && Array.isArray(current)) {
            for (let i = 0; i < current.length; i++) {
              const e = current[i] as JsonElement
              yield* walk_path([...parts, part.for_array(i)], at + 1, e)
            }
          } else if (typeof current === 'object') {
            yield* walk_path([...parts, part], at + 1, current)
          }
        }
      }
    }

    yield* walk_path([], 0, elem)
  }

  public add(path: Path): Path {
    return new Path({ parts: this.parts.concat(path.parts), root: this.root })
  }

  toString(): string {
    const root = this.root ? '/' : ''
    return root + this.parts.join('.')
  }

  static from_string(str: string): Path {
    return parse_path(str)
  }

  static from(parts: string | string[], root?: boolean): Path {
    parts = typeof parts === 'string' ? [parts] : parts
    return new Path({ parts: parts.map((name) => new PathPart({ name })), root })
  }

  static empty(): Path {
    return new Path({})
  }
}

export abstract class Term {
  [immerable] = true

  and_term(other: Term): Term {
    if (this instanceof AllTerm) return other
    else if (other instanceof AllTerm) return this
    else return new CombinedTerm({ left: this, op: 'and', right: other })
  }

  or_term(other: Term): Term {
    if (this instanceof AllTerm) return this
    else if (other instanceof AllTerm) return other
    else return new CombinedTerm({ left: this, op: 'or', right: other })
  }

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
        if (left instanceof AllTerm && right instanceof AllTerm) return new AllTerm()
        else if (left instanceof AllTerm) return right
        else if (right instanceof AllTerm) return left
        else return new CombinedTerm({ left, op: this.op, right })
      }
    }
    return this
  }

  abstract toString(): string

  matches(js: JsonElement): boolean {
    if (this instanceof AllTerm) return true
    else if (this instanceof Predicate) {
      const path = this.path.find(js, (js) => Predicate.matches_value(this.value, this.op, js))
      return !path.next().done
    } else if (this instanceof ContextTerm) {
      for (const [_, value] of this.path.find(js)) {
        if (this.term.matches(value)) {
          return true
        }
      }
      return false
    } else if (this instanceof CombinedTerm) {
      const left = this.left.matches(js)
      const right = this.right.matches(js)
      return this.op == 'and' ? left && right : left || right
    } else if (this instanceof NotTerm) {
      return !this.term.matches(js)
    } else return true // ignore other terms
  }

  find_paths(js: JsonElement): Path[] {
    let result: Path[] = []
    if (this instanceof CombinedTerm) {
      const left = this.left.matches(js)
      const right = this.right.matches(js)
      if (left && right) {
        result = result.concat(this.left.find_paths(js))
        result = result.concat(this.right.find_paths(js))
      } else if (this.op === 'or' && left) {
        result = result.concat(this.left.find_paths(js))
      } else if (this.op === 'or' && right) {
        result = result.concat(this.right.find_paths(js))
      }
    } else if (this instanceof NotTerm) {
      if (!this.term.matches(js)) {
        result = result.concat(this.term.find_paths(js))
      }
    } else if (this instanceof Predicate) {
      if (this.matches(js)) {
        for (const [path, _] of this.path.find(js)) {
          result.push(path)
        }
      }
    } else if (this instanceof ContextTerm) {
      if (this.matches(js)) {
        for (const [path, hit] of this.path.find(js)) {
          this.term.find_paths(hit).forEach((p) => result.push(path.add(p)))
        }
      }
    }
    return result
  }

  delete_matching(js: JsonElement): JsonElement {
    const draft = new JsonElementDraft(js)
    for (const path of this.find_paths(js)) {
      for (const hit of draft.find(path)) hit.delete()
    }
    return draft.final_value
  }

  rewrite_synthetic_properties(): Term {
    const reverse_operation = (op: string): string => {
      if (op == '>=') return '<='
      else if (op == '>') return '<'
      else if (op == '<=') return '>='
      else if (op == '<') return '>'
      else return op
    }
    const mapping: Record<string, string> = { age: 'ctime', last_updated: 'mtime', last_access: 'atime' }
    const synthetic_props = Object.keys(mapping).map((k) => Path.from(k))
    return produce(this, (draft) => {
      draft
        .find_terms((term) => term instanceof Predicate)
        .map((term) => {
          const predicate = term as Predicate
          synthetic_props
            .filter((path) => predicate.path.startsWith(path))
            .map((path) => {
              predicate.path = Path.from(mapping[path.toString()])
              predicate.op = reverse_operation(predicate.op)
            })
        })
    })
  }
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
  path: Path
  op: string
  value: JsonElement
  args: Record<string, JsonElement>

  constructor({ path, op, value, args }: { path: Path; op: string; value: JsonElement; args?: Record<string, JsonElement> | undefined }) {
    super()
    this.path = path
    this.op = op
    this.value = value
    this.args = args || {}
  }

  toString(): string {
    const modifier = this.args?.filter?.toString() || ''
    let value: string
    if (typeof this.value === 'string') {
      value = `"${this.value}"`
    } else {
      value = JSON.stringify(this.value)
    }
    return `${this.path.toString()} ${modifier}${this.op} ${value}`
  }

  static matches_value(value: JsonElement, op: string, p: JsonElement): boolean {
    if (p == null && value == null) return true
    else if (op === '!=') return p !== value
    else if (op === '==' || op === '=') return p === value
    else if (p == null || value == null) return false
    else if (op === '>') return p > value
    else if (op === '>=') return p >= value
    else if (op === '<') return p < value
    else if (op === '<=') return p <= value
    else if (op === '~' || op === '=~') return new RegExp(value as string).test(p as string)
    else if (op === '!~') return !new RegExp(value as string).test(p as string)
    else if (op === 'in') return (value as JsonElement[]).includes(p)
    else if (op === 'not in') return !(value as JsonElement[]).includes(p)
    else return false
  }
}

export class ContextTerm extends Term {
  path: Path
  term: Term

  constructor({ path, term }: { path: Path; term: Term }) {
    super()
    this.path = path
    this.term = term
  }

  toString(): string {
    return `${this.path.toString()}.{${this.term.toString()}}`
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
  path: Path
  query: Query

  constructor({ path, query }: { path: Path; query: Query }) {
    this.path = path
    this.query = query
  }

  toString(): string {
    return `${this.path.toString()}: ${this.query.toString().replace(/^\s*all\s*/, '')}`
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

export class WithUsage {
  [immerable] = true

  start: string
  end: string | undefined
  metrics: Array<string>

  constructor({ start, end, metrics }: { start: string; end?: string | undefined; metrics: Array<string> }) {
    this.start = start
    this.end = end
    this.metrics = metrics
  }

  toString(): string {
    const end = this.end ? `::${this.end}` : ''
    return `with_usage(${this.start}${end}, [${this.metrics.join(',')}])`
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
    const et = this.edge_types === undefined || this.edge_types.every((v) => v === EdgeType.default) ? '' : this.edge_types.join(',')
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
  path: Path
  order: SortOrder = SortOrder.asc

  constructor({ path, order = SortOrder.asc }: { path: Path; order?: SortOrder }) {
    this.path = path
    this.order = order
  }

  toString(): string {
    return `${this.path.toString()} ${this.order}`
  }
}

export class Part {
  [immerable] = true
  term: Term
  with_clause: WithClause | undefined
  with_usage: WithUsage | undefined
  sort: Sort[]
  limit?: Limit
  navigation?: Navigation

  constructor({
    term,
    with_clause,
    with_usage,
    sort = [],
    limit,
    navigation,
  }: {
    term: Term
    with_clause?: WithClause
    with_usage?: WithUsage
    sort?: Sort[]
    limit?: Limit
    navigation?: Navigation
  }) {
    this.term = term
    this.with_clause = with_clause
    this.with_usage = with_usage
    this.sort = sort
    this.limit = limit
    this.navigation = navigation
  }

  toString(): string {
    const with_usage = this.with_usage ? ` ${this.with_usage.toString()}` : ''
    const with_clause = this.with_clause ? ` ${this.with_clause.toString()}` : ''
    const sort = this.sort.length > 0 ? ` sort ${this.sort.map((s) => s.toString()).join(', ')}` : ''
    const limit = this.limit ? ` ${this.limit.toString()}` : ''
    const nav = this.navigation ? ` ${this.navigation.toString()}` : ''
    return `${with_usage}${this.term.toString()}${with_clause}${sort}${limit}${nav}`
  }
}
export class AggregateVariableName {
  [immerable] = true
  path: Path
  constructor({ path }: { path: Path }) {
    this.path = path
  }

  toString(): string {
    return this.path.toString()
  }
}
export class AggregateVariableCombined {
  [immerable] = true
  name: string

  constructor({ name }: { name: string }) {
    this.name = name
  }

  toString(): string {
    return this.name
  }
}

export class AggregateVariable {
  [immerable] = true
  name: AggregateVariableName | AggregateVariableCombined
  as_name: string | undefined
  constructor({ name, as_name }: { name: AggregateVariableName | AggregateVariableCombined; as_name: string | undefined }) {
    this.name = name
    this.as_name = as_name
  }
  toString(): string {
    const with_as = this.as_name ? ` as ${this.as_name}` : ''
    return `${this.name.toString()}${with_as}`
  }
}

export class AggregateOp {
  [immerable] = true
  operation: string
  value: number
  constructor({ operation, value }: { operation: string; value: number }) {
    this.operation = operation
    this.value = value
  }
}

export class AggregateFunction {
  [immerable] = true
  func: string
  path: Path | number
  ops: AggregateOp[]
  as_name: string | undefined
  constructor({ func, path, ops, as_name }: { func: string; path: Path | number; ops: AggregateOp[]; as_name: string | undefined }) {
    this.func = func
    this.path = path
    this.ops = ops
    this.as_name = as_name
  }
  toString(): string {
    const with_as = this.as_name ? ` as ${this.as_name}` : ''
    const with_ops = this.ops.map((op) => ` ${op.operation} ${op.value}`).join(' ')
    return `${this.func}(${this.path.toString()}${with_ops})${with_as}`
  }
}

export class Aggregate {
  [immerable] = true
  group_by: AggregateVariable[]
  group_func: AggregateFunction[]
  constructor({ group_by, group_func }: { group_by: AggregateVariable[]; group_func: AggregateFunction[] }) {
    this.group_by = group_by
    this.group_func = group_func
  }

  toString(): string {
    const grouped = this.group_by.map((gb) => gb.toString()).join(', ')
    const funcs = this.group_func.map((fn) => fn.toString()).join(', ')
    const delim = this.group_by.length > 0 ? ': ' : ''
    return `aggregate(${grouped}${delim}${funcs})`
  }
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

  public combine(other: Query): Query {
    if (this.aggregate && other.aggregate) {
      throw new Error('Cannot combine two aggregate queries')
    }
    const aggregate = this.aggregate ? this.aggregate : other.aggregate
    let parts: Part[] = []
    if (this.parts.length === 0) {
      parts = other.parts
    } else if (other.parts.length === 0) {
      parts = this.parts
    } else if (this.parts[this.parts.length - 1].navigation) {
      parts = other.parts.concat(this.parts)
    } else {
      const left_last = this.parts[this.parts.length - 1]
      const right_first = other.parts[0]
      if (left_last.with_clause && right_first.with_clause) {
        throw Error('Can not combine 2 with clauses!')
      }
      const term = left_last.term.and_term(right_first.term)
      const with_clause = left_last.with_clause ? left_last.with_clause : right_first.with_clause
      const sort = left_last.sort.concat(right_first.sort)
      const limit = combineOptional(
        left_last.limit,
        right_first.limit,
        (l, r) => new Limit({ offset: Math.max(l.offset, r.offset), length: Math.min(l.length, r.length) }),
      )
      const combined = new Part({ term, with_clause, sort, limit, navigation: right_first.navigation })
      parts = [...other.parts.slice(0, -1), combined, ...this.parts.slice(1)]
    }
    return new Query({ parts, preamble: { ...this.preamble, ...other.preamble }, aggregate })
  }

  toString(): string {
    const aggregate = this.aggregate ? this.aggregate.toString() : ''
    const pre = Object.entries(this.preamble)
    const colon = pre.length > 0 || this.aggregate != undefined ? ': ' : ''
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

  public fulltexts(): FulltextTerm[] {
    // The UI assumes that all parts are AND combined. Do not walk OR parts.
    const only_and_parts = (wd: Term) => !(wd instanceof CombinedTerm) || wd.op === 'and'
    return this.working_part.term.find_terms((t) => t instanceof FulltextTerm, only_and_parts) as FulltextTerm[]
  }

  public get remaining_predicates(): Record<string, JsonElement> {
    // neither cloud, account, region, tags nor severity
    return this.predicates()
      .filter(
        (p) => !p.path.startsWith('ancestors', true) && !p.path.startsWith(['security', 'severity'], true) && !p.path.startsWith('tags'),
      )
      .reduce((acc, pred) => ({ ...acc, [pred.path.toString()]: pred.value }), {} as { [key: string]: JsonElement })
  }

  public get cloud(): Predicate | undefined {
    return this.predicates().find((p) => CloudIdentifier.has(p.path.toString()))
  }

  public get account(): Predicate | undefined {
    return this.predicates().find((p) => AccountIdentifier.has(p.path.toString()))
  }

  public get region(): Predicate | undefined {
    return this.predicates().find((p) => RegionIdentifier.has(p.path.toString()))
  }

  public set_predicate(name: string, op: string, value: JsonElement): Query {
    const path = Path.from_string(name)
    return produce(this, (draft) => {
      const existing = draft.predicates().find((p) => p.path.equalTo(path))
      if (existing) {
        existing.op = op
        existing.value = value
      } else {
        draft.working_part.term = new Predicate({ path, op, value }).and_term(draft.working_part.term)
      }
    })
  }

  public update_fulltext(value?: string, prevValue?: string): Query {
    return produce(this, (draft) => {
      if (value) {
        if (prevValue) {
          const item = draft.fulltexts().find((i) => i.text === prevValue)
          if (item) {
            item.text = value
            return
          }
        }
        draft.working_part.term = new FulltextTerm({ text: value }).and_term(draft.working_part.term)
      } else {
        if (prevValue) {
          const item = draft.fulltexts().find((i) => i.text === prevValue)
          if (item) {
            draft.working_part.term = draft.working_part.term.delete_terms((t) => t === item)
          }
        }
      }
    })
  }

  public delete_predicate(name: string): Query {
    const path = Path.from_string(name)
    return produce(this, (draft) => {
      const existing = draft.predicates().find((p) => p.path.equalTo(path))
      if (existing) {
        draft.working_part.term = draft.working_part.term.delete_terms((t) => existing === t)
      }
    })
  }

  public set_is(kinds: string[]): Query {
    return produce(this, (draft) => {
      const existing = draft.is()
      if (existing) {
        existing.kinds = kinds
      } else {
        draft.working_part.term = new IsTerm({ kinds }).and_term(draft.working_part.term)
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
      .filter((p) => p.path.startsWith('tags'))
      .reduce((acc, pred) => ({ ...acc, [pred.path.toString()]: pred.value }), {} as { [key: string]: JsonElement })
  }

  public get severity(): Predicate | undefined {
    return this.predicates().find((p) => p.path.startsWith(['security', 'severity'], true))
  }

  /**
   * Takes resource json (the reported section) and returns a list of paths that get matched by the query.
   *
   * Note:
   * Certain criteria of a query cannot be matched by the resource data, e.g. with clauses, merge queries, or aggregate queries.
   * Please use `provides_security_check_details` to check if the query can provide details based on resource data.
   * @param json the resource json
   */
  public find_paths(json: JsonElement): Path[] {
    return this.working_part.term.rewrite_synthetic_properties().find_paths(json)
  }

  /**
   * Takes resource json (the reported section) and returns a new json with the parts that match the query deleted.
   *
   * Note:
   * Certain criteria of a query cannot be matched by the resource data, e.g. with clauses, merge queries, or aggregate queries.
   * Please use `provides_security_check_details` to check if the query can provide details based on resource data.
   * @param json the resource json
   */
  public delete_matching(json: JsonElement): JsonElement {
    return this.working_part.term.rewrite_synthetic_properties().delete_matching(json)
  }

  /**
   * Signals, if this query can provide details based on resource data.
   *
   * To show details, the check must use a plain fix query.
   * To reason about the resource data, the query should not use one of the following:
   * - with clause: graph traversals are used that are not available in the resource data
   * - merge queries: if the query uses merges, they are not available in the resource data
   * - aggregate: if the query uses an aggregate, the result is not available in the resource data
   */
  public provides_security_check_details(): boolean {
    return (
      this.aggregate == undefined &&
      this.parts.length == 1 &&
      this.parts.every((part) => part.with_clause == undefined && part.term.find_terms((t) => t instanceof MergeTerm).length == 0)
    )
  }

  public get sorts() {
    return this.working_part.sort
  }

  static parse(query: string, template_parameters: { [key: string]: JsonElement } = {}): Query {
    return parse_query(render(query, template_parameters))
  }
}
