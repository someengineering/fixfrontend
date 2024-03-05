import * as assert from 'assert'
import { expectEOF, expectSingleResult } from 'typescript-parsec'
import {
  BoolOperationP,
  FixQueryLexer,
  JsonElementP,
  LimitP,
  NavigationP,
  PartP,
  QueryP,
  SimpleTermP,
  SortP,
  TermP,
  VariableP,
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
  JsonElement,
  Limit,
  Navigation,
  Part,
  Predicate,
  Query,
  Sort,
  SortOrder,
  Term,
} from './query.ts'

function parse_variable(expr: string): string {
  return expectSingleResult(expectEOF(VariableP.parse(FixQueryLexer.parse(expr))))
}
function parse_bool_operation(expr: string): string {
  return expectSingleResult(expectEOF(BoolOperationP.parse(FixQueryLexer.parse(expr))))
}
function parse_json(expr: string): JsonElement {
  return expectSingleResult(expectEOF(JsonElementP.parse(FixQueryLexer.parse(expr))))
}

function parse_simple_term(expr: string): Term {
  return expectSingleResult(expectEOF(SimpleTermP.parse(FixQueryLexer.parse(expr))))
}
function parse_sort(expr: string): Term {
  return expectSingleResult(expectEOF(SortP.parse(FixQueryLexer.parse(expr))))
}
function parse_limit(expr: string): Limit {
  return expectSingleResult(expectEOF(LimitP.parse(FixQueryLexer.parse(expr))))
}
function parse_navigation(expr: string): Navigation {
  const result = expectEOF(NavigationP.parse(FixQueryLexer.parse(expr)))
  if (result.successful) {
    return result.candidates[0].result
  } else {
    throw new Error(result.error.message)
  }
}
function parse_part(expr: string): Part {
  const result = expectEOF(PartP.parse(FixQueryLexer.parse(expr)))
  if (result.successful) {
    return result.candidates[0].result
  } else {
    throw new Error(result.error.message)
  }
}

function parse_term(expr: string): Term {
  const result = expectEOF(TermP.parse(FixQueryLexer.parse(expr)))
  if (result.successful) {
    return result.candidates[0].result
  } else {
    throw new Error(result.error.message)
  }
}
function parse_query(expr: string): Term {
  const result = expectEOF(QueryP.parse(FixQueryLexer.parse(expr)))
  if (result.successful) {
    return result.candidates[0].result
  } else {
    throw new Error(result.error.message)
  }
}

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
})

test(`Parse Simple Term`, () => {
  assert.deepEqual(parse_simple_term('is(instance)'), new IsTerm(['instance']))
  assert.deepEqual(parse_simple_term('id(test1234)'), new IdTerm(['test1234']))
  assert.deepEqual(parse_simple_term('all'), new AllTerm())
  assert.deepEqual(parse_simple_term('foo==23'), new Predicate('foo', '==', 23, {}))
  assert.deepEqual(parse_simple_term('bla!=["1", 2]'), new Predicate('bla', '!=', ['1', 2], {}))
  assert.deepEqual(parse_simple_term('foo.bla.bar.{test=23}'), new ContextTerm('foo.bla.bar', new Predicate('test', '=', 23, {})))
  assert.deepEqual(parse_simple_term('"test"'), new FulltextTerm('test'))
})

test(`Parse Term`, () => {
  // can also parse simple terms
  assert.deepEqual(parse_term('is(instance)'), new IsTerm(['instance']))
  assert.deepEqual(parse_term('id(test1234)'), new IdTerm(['test1234']))
  assert.deepEqual(parse_term('all'), new AllTerm())
  assert.deepEqual(parse_term('foo==23'), new Predicate('foo', '==', 23, {}))
  assert.deepEqual(parse_term('bla!=["1", 2]'), new Predicate('bla', '!=', ['1', 2], {}))
  assert.deepEqual(parse_term('foo.bla.bar.{test=23}'), new ContextTerm('foo.bla.bar', new Predicate('test', '=', 23, {})))
  assert.deepEqual(parse_term('"test"'), new FulltextTerm('test'))
  assert.deepEqual(parse_term('"test" or "goo"'), new CombinedTerm(new FulltextTerm('test'), 'or', new FulltextTerm('goo')))
  assert.deepEqual(parse_term('("test" or "goo")'), new CombinedTerm(new FulltextTerm('test'), 'or', new FulltextTerm('goo')))
  assert.deepEqual(parse_term('(("test") or ("goo"))'), new CombinedTerm(new FulltextTerm('test'), 'or', new FulltextTerm('goo')))
  assert.deepEqual(
    parse_term('(ab > 23 and (("test") or ("goo")))'),
    new CombinedTerm(new Predicate('ab', '>', 23, {}), 'and', new CombinedTerm(new FulltextTerm('test'), 'or', new FulltextTerm('goo'))),
  )
})

test(`Parse Sort`, () => {
  assert.deepEqual(parse_sort('sort foo.bar'), [new Sort('foo.bar', SortOrder.Asc)])
  assert.deepEqual(parse_sort('sort foo.bar asc'), [new Sort('foo.bar', SortOrder.Asc)])
  assert.deepEqual(parse_sort('sort foo.bar desc'), [new Sort('foo.bar', SortOrder.Desc)])
  assert.deepEqual(parse_sort('sort foo asc, bar desc, bla'), [
    new Sort('foo', SortOrder.Asc),
    new Sort('bar', SortOrder.Desc),
    new Sort('bla', SortOrder.Asc),
  ])
})

test(`Parse Limit`, () => {
  assert.deepEqual(parse_limit('limit 10'), new Limit(0, 10))
  assert.deepEqual(parse_limit('limit 10,20'), new Limit(10, 20))
})

test(`Parse Navigation`, () => {
  assert.deepEqual(parse_navigation('-->'), new Navigation())
  assert.deepEqual(parse_navigation('-[2:3]->'), new Navigation(2, 3))
  assert.deepEqual(parse_navigation('-[2:3]delete->'), new Navigation(2, 3, [EdgeType.delete]))
  assert.deepEqual(parse_navigation('-delete[2:3]->'), new Navigation(2, 3, [EdgeType.delete]))
  assert.deepEqual(parse_navigation('<-delete[2:3]->'), new Navigation(2, 3, [EdgeType.delete], Direction.any))
})

test(`Parse Part`, () => {
  const pred = new Predicate('foo', '=', 23, {})
  const ctx = new ContextTerm('bar.test', new Predicate('num', '>', 23, {}))
  const is = new IsTerm(['instance'])
  const combined = new CombinedTerm(new CombinedTerm(is, 'and', pred), 'and', ctx)
  const sort = [new Sort('bla', SortOrder.Asc)]
  const limit = new Limit(0, 10)
  assert.deepEqual(parse_part('foo=23 sort bla limit 10'), new Part(pred, undefined, sort, limit, undefined))
  assert.deepEqual(
    parse_part('is(instance) and foo=23 and bar.test.{num>23} sort bla limit 10'),
    new Part(combined, undefined, sort, limit, undefined),
  )
  assert.deepEqual(parse_part('is(instance) -->'), new Part(is, undefined, undefined, undefined, new Navigation()))
})

test(`Parse Query`, () => {
  const pred = new Predicate('foo', '=', 23, {})
  const ctx = new ContextTerm('bar.test', new Predicate('num', '>', 23, {}))
  const is = new IsTerm(['instance'])
  const combined = new CombinedTerm(new CombinedTerm(is, 'and', pred), 'and', ctx)
  const sort = [new Sort('bla', SortOrder.Asc)]
  const limit = new Limit(0, 10)
  const part = new Part(pred, undefined, sort, limit, undefined)
  assert.deepEqual(parse_query('foo=23 sort bla limit 10'), new Query([part]))
  assert.deepEqual(
    parse_query('is(instance) and foo=23 and bar.test.{num>23} sort bla limit 10 --> foo=23 sort bla limit 10'),
    new Query([new Part(combined, undefined, sort, limit, new Navigation()), part]),
  )
})
