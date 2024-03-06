import * as assert from 'assert'
import { expectEOF, Rule } from 'typescript-parsec'
import {
  BoolOperationP,
  FixQueryLexer,
  JsonElementP,
  LimitP,
  MergeQueryP,
  NavigationP,
  PartP,
  QueryP,
  SimpleTermP,
  SortP,
  TermP,
  Token,
  VariableP,
  WithClauseP,
} from './parser.ts'
import {
  AllTerm,
  CombinedTerm,
  ContextTerm,
  Direction,
  EdgeType,
  FulltextTerm,
  IdTerm,
  IsTerm,
  Limit,
  MergeQuery,
  MergeTerm,
  Navigation,
  Part,
  Predicate,
  Query,
  Sort,
  SortOrder,
  WithClause,
  WithClauseFilter,
} from './query.ts'

function parse_expr<T>(parser: Rule<Token, T>): (expr: string) => T {
  function parse(expr: string): T {
    const result = expectEOF(parser.parse(FixQueryLexer.parse(expr)))
    if (result.successful) {
      return result.candidates[0].result
    } else {
      throw new Error(result.error.message)
    }
  }

  return parse
}

const parse_variable = parse_expr(VariableP)
const parse_bool_operation = parse_expr(BoolOperationP)
const parse_json = parse_expr(JsonElementP)
const parse_simple_term = parse_expr(SimpleTermP)
const parse_sort = parse_expr(SortP)
const parse_limit = parse_expr(LimitP)
const parse_navigation = parse_expr(NavigationP)
const parse_part = parse_expr(PartP)
const parse_term = parse_expr(TermP)
const parse_query = parse_expr(QueryP)
const parse_merge_query = parse_expr(MergeQueryP)
const parse_with_clause = parse_expr(WithClauseP)

test(`Parse Json`, () => {
  assert.strictEqual(parse_json('1'), 1)
  assert.strictEqual(parse_json('test'), 'test')
  assert.strictEqual(parse_json('  "test" '), 'test')
  assert.deepEqual(parse_json('[]'), [])
  assert.deepEqual(parse_json('[1]'), [1])
  assert.deepEqual(parse_json('[1,2,3,4]'), [1, 2, 3, 4])
  assert.deepEqual(parse_json('{}'), {})
  assert.deepEqual(parse_json('{foo:[23]}'), { foo: [23] })
  assert.deepEqual(parse_json('{foo:  [23], bla:   "test"}'), { foo: [23], bla: 'test' })
})

test(`Parse Bool Operation`, () => {
  assert.strictEqual(parse_bool_operation('and'), 'and')
  assert.strictEqual(parse_bool_operation('or'), 'or')
})

test(`Parse Variable`, () => {
  assert.strictEqual(parse_variable('foo'), 'foo')
  assert.strictEqual(parse_variable('/foo'), '/foo')
  assert.strictEqual(parse_variable('foo.bla.bar'), 'foo.bla.bar')
  assert.strictEqual(parse_variable('/foo.bla.bar'), '/foo.bla.bar')
  assert.strictEqual(parse_variable('/foo[*].bla[].bar[*]'), '/foo[*].bla[].bar[*]')
})

test(`Parse Simple Term`, () => {
  assert.deepEqual(parse_simple_term('is(instance)'), new IsTerm({ kinds: ['instance'] }))
  assert.deepEqual(parse_simple_term('id(test1234)'), new IdTerm({ ids: ['test1234'] }))
  assert.deepEqual(parse_simple_term('all'), new AllTerm())
  assert.deepEqual(parse_simple_term('foo==23'), new Predicate({ name: 'foo', op: '==', value: 23 }))
  assert.deepEqual(parse_simple_term('bla!=["1", 2]'), new Predicate({ name: 'bla', op: '!=', value: ['1', 2] }))
  assert.deepEqual(
    parse_simple_term('foo.bla.bar.{test=23}'),
    new ContextTerm({
      name: 'foo.bla.bar',
      term: new Predicate({ name: 'test', op: '=', value: 23 }),
    }),
  )
  assert.deepEqual(parse_simple_term('"test"'), new FulltextTerm({ text: 'test' }))
})

test(`Parse Term`, () => {
  // can also parse simple terms
  assert.deepEqual(parse_term('is(instance)'), new IsTerm({ kinds: ['instance'] }))
  assert.deepEqual(parse_term('id(test1234)'), new IdTerm({ ids: ['test1234'] }))
  assert.deepEqual(parse_term('all'), new AllTerm())
  assert.deepEqual(parse_term('foo==23'), new Predicate({ name: 'foo', op: '==', value: 23 }))
  assert.deepEqual(parse_term('bla!=["1", 2]'), new Predicate({ name: 'bla', op: '!=', value: ['1', 2] }))
  assert.deepEqual(
    parse_term('foo.bla.bar.{test=23}'),
    new ContextTerm({
      name: 'foo.bla.bar',
      term: new Predicate({ name: 'test', op: '=', value: 23 }),
    }),
  )
  const ftt = new FulltextTerm({ text: 'test' })
  const ftg = new FulltextTerm({ text: 'goo' })
  assert.deepEqual(parse_term('"test"'), ftt)
  assert.deepEqual(parse_term('"test" or "goo"'), new CombinedTerm({ left: ftt, op: 'or', right: ftg }))
  assert.deepEqual(parse_term('("test" or "goo")'), new CombinedTerm({ left: ftt, op: 'or', right: ftg }))
  assert.deepEqual(parse_term('(("test") or ("goo"))'), new CombinedTerm({ left: ftt, op: 'or', right: ftg }))
  assert.deepEqual(
    parse_term('(ab > 23 and (("test") or ("goo")))'),
    new CombinedTerm({
      left: new Predicate({ name: 'ab', op: '>', value: 23 }),
      op: 'and',
      right: new CombinedTerm({ left: ftt, op: 'or', right: ftg }),
    }),
  )
})

test(`Parse Sort`, () => {
  assert.deepEqual(parse_sort('sort foo.bar'), [new Sort({ name: 'foo.bar', order: SortOrder.Asc })])
  assert.deepEqual(parse_sort('sort foo.bar asc'), [new Sort({ name: 'foo.bar', order: SortOrder.Asc })])
  assert.deepEqual(parse_sort('sort foo.bar desc'), [new Sort({ name: 'foo.bar', order: SortOrder.Desc })])
  assert.deepEqual(parse_sort('sort foo asc, bar desc, bla'), [
    new Sort({ name: 'foo', order: SortOrder.Asc }),
    new Sort({ name: 'bar', order: SortOrder.Desc }),
    new Sort({ name: 'bla', order: SortOrder.Asc }),
  ])
})

test(`Parse Limit`, () => {
  assert.deepEqual(parse_limit('limit 10'), new Limit({ length: 10 }))
  assert.deepEqual(parse_limit('limit 10,20'), new Limit({ offset: 10, length: 20 }))
})

test(`Parse Navigation`, () => {
  assert.deepEqual(parse_navigation('-->'), new Navigation())
  assert.deepEqual(parse_navigation('-[2:3]->'), new Navigation({ start: 2, until: 3 }))
  assert.deepEqual(
    parse_navigation('-[2:3]delete->'),
    new Navigation({
      start: 2,
      until: 3,
      edge_types: [EdgeType.delete],
    }),
  )
  assert.deepEqual(
    parse_navigation('-delete[2:3]->'),
    new Navigation({
      start: 2,
      until: 3,
      edge_types: [EdgeType.delete],
    }),
  )
  assert.deepEqual(
    parse_navigation('<-delete[2:3]->'),
    new Navigation({
      start: 2,
      until: 3,
      edge_types: [EdgeType.delete],
      direction: Direction.any,
    }),
  )
})

test(`Parse WithClause`, () => {
  const with_filter = new WithClauseFilter({ op: '>', num: 0 })
  const navigation = new Navigation()
  const term = new IsTerm({ kinds: ['instance'] })
  const with_clause = new WithClause({ with_filter, navigation, term })
  assert.deepEqual(parse_with_clause('with(any, --> is(instance))'), with_clause)
  assert.deepEqual(
    parse_with_clause('with(any, --> is(instance) with(any, --> is(instance)))'),
    new WithClause({
      with_filter,
      navigation,
      term,
      with_clause,
    }),
  )
})

test(`Parse Part`, () => {
  const pred = new Predicate({ name: 'foo', op: '=', value: 23 })
  const ctx = new ContextTerm({ name: 'bar.test', term: new Predicate({ name: 'num', op: '>', value: 23 }) })
  const is = new IsTerm({ kinds: ['instance'] })
  const combined = new CombinedTerm({
    left: new CombinedTerm({ left: is, op: 'and', right: pred }),
    op: 'and',
    right: ctx,
  })
  const sort = [new Sort({ name: 'bla', order: SortOrder.Asc })]
  const limit = new Limit({ length: 10 })
  assert.deepEqual(parse_part('foo=23 sort bla limit 10'), new Part({ term: pred, sort, limit }))
  assert.deepEqual(
    parse_part('is(instance) and foo=23 and bar.test.{num>23} sort bla limit 10'),
    new Part({
      term: combined,
      sort,
      limit,
    }),
  )
  assert.deepEqual(parse_part('is(instance) -->'), new Part({ term: is, navigation: new Navigation() }))
})

test(`Parse Merge Query`, () => {
  const pred = new Predicate({ name: 'foo', op: '=', value: 23 })
  const part = new Part({ term: pred })
  assert.deepEqual(
    parse_merge_query('test: <-- foo=23'),
    new MergeQuery({
      name: 'test',
      query: new Query({ parts: [new Part({ term: new AllTerm(), navigation: new Navigation({ direction: Direction.inbound }) }), part] }),
    }),
  )
})

test(`Parse Query`, () => {
  const pred = new Predicate({ name: 'foo', op: '=', value: 23 })
  const ctx = new ContextTerm({ name: 'bar.test', term: new Predicate({ name: 'num', op: '>', value: 23 }) })
  const is = new IsTerm({ kinds: ['instance'] })
  const combined = new CombinedTerm({
    left: new CombinedTerm({ left: is, op: 'and', right: pred }),
    op: 'and',
    right: ctx,
  })
  const sort = [new Sort({ name: 'bla', order: SortOrder.Asc })]
  const limit = new Limit({ length: 10 })
  const part = new Part({ term: pred, sort, limit })
  const with_clause = new WithClause({
    with_filter: new WithClauseFilter({ op: '==', num: 0 }),
    navigation: new Navigation({ direction: Direction.inbound }),
    term: pred,
  })
  assert.deepEqual(parse_query('foo=23 sort bla limit 10'), new Query({ parts: [part] }))
  assert.deepEqual(
    parse_query('is(instance) with(empty, <-- foo=23) sort bla limit 10'),
    new Query({ parts: [new Part({ term: is, with_clause, sort, limit })] }),
  )
  assert.deepEqual(
    parse_query('is(instance) and foo=23 and bar.test.{num>23} sort bla limit 10 --> foo=23 sort bla limit 10'),
    new Query({ parts: [new Part({ term: combined, sort, limit, navigation: new Navigation() }), part] }),
  )
  assert.deepEqual(
    parse_query('is(instance) {test: --> foo=23, bla: <-- is(instance)}'),
    new Query({
      parts: [
        new Part({
          term: new MergeTerm({
            preFilter: is,
            merge: [
              new MergeQuery({
                name: 'test',
                query: new Query({
                  parts: [
                    new Part({ term: new AllTerm(), navigation: new Navigation({ direction: Direction.outbound }) }),
                    new Part({ term: pred }),
                  ],
                }),
              }),
              new MergeQuery({
                name: 'bla',
                query: new Query({
                  parts: [
                    new Part({ term: new AllTerm(), navigation: new Navigation({ direction: Direction.inbound }) }),
                    new Part({ term: is }),
                  ],
                }),
              }),
            ],
          }),
        }),
      ],
    }),
  )
})
