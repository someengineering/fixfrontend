import assert from 'assert'
import { JsonElement, JsonElementDraft, Path, Query } from './query.ts'

test('Test query properties', () => {
  const query = Query.parse(
    'is(foo) and prop==42 and /ancestors.cloud.reported.name=="aws" and /ancestors.account.reported.name=="test" and /ancestors.region.reported.name="us-east-1" and tags.agent==42 and tags.foo="bla" and /security.severity in ["high","critical"]',
  )
  assert.strictEqual(query.predicates().length, 7)
  assert.strictEqual(query.cloud!.value, 'aws')
  assert.strictEqual(query.account!.value, 'test')
  assert.deepEqual(query.tags, { 'tags.agent': 42, 'tags.foo': 'bla' })
  assert.deepEqual(query.severity!.value, ['high', 'critical'])
  assert.deepEqual(query.remaining_predicates, { prop: 42 })

  const query_w_or = Query.parse(
    'is(foo) and prop==42 and /ancestors.cloud.reported.name=="aws" and (/ancestors.account.reported.name=="test" or (tags.agent==42 or tags.foo="bla")) and /security.severity in ["high","critical"]',
  )
  assert.strictEqual(query_w_or.predicates().length, 3)
  assert.strictEqual(query_w_or.cloud!.value, 'aws')
  assert.strictEqual(query_w_or.account, undefined) // account is defined in an or clause
  assert.deepEqual(query_w_or.tags, {}) // tags are defined in an or clause
  assert.deepEqual(query_w_or.severity!.value, ['high', 'critical'])
  assert.deepEqual(query_w_or.remaining_predicates, { prop: 42 })
})

test('Test toString', () => {
  const q =
    'is(foo) and prop == 42 and /ancestors.cloud.reported.name == "aws" and /ancestors.account.reported.name == "test" and /ancestors.region.reported.name == "us-east-1" and (tags.agent == 42 or tags.foo == "bla") and /security.severity in ["high","critical"]'
  const query = Query.parse(q)
  assert.strictEqual(query.toString(), q)
})

test('Update a query', () => {
  const q = 'is(foo) and prop == 42 and /ancestors.cloud.reported.name == "aws" and /ancestors.account.reported.name == "test"'
  const query = Query.parse(q)

  // update query: update existing property gcp as cloud
  let updated = query.set_predicate('/ancestors.cloud.reported.name', '==', 'gcp')
  assert.strictEqual(
    updated.toString(),
    'is(foo) and prop == 42 and /ancestors.cloud.reported.name == "gcp" and /ancestors.account.reported.name == "test"',
  )
  assert.strictEqual(updated.cloud!.value, 'gcp')

  // region was not defined
  updated = updated.set_predicate('/ancestors.region.reported.name', '!=', 'us-west-1')
  assert.strictEqual(
    updated.toString(),
    '/ancestors.region.reported.name != "us-west-1" and is(foo) and prop == 42 and /ancestors.cloud.reported.name == "gcp" and /ancestors.account.reported.name == "test"',
  )
  assert.strictEqual(updated.region!.value, 'us-west-1')

  // update prop
  updated = updated.set_predicate('prop', '>', 43)
  updated = updated.set_predicate('prop', '>', 44)
  updated = updated.set_predicate('prop', '>', 45)
  updated = updated.set_predicate('prop', '<', 46)
  assert.strictEqual(
    updated.toString(),
    '/ancestors.region.reported.name != "us-west-1" and is(foo) and prop < 46 and /ancestors.cloud.reported.name == "gcp" and /ancestors.account.reported.name == "test"',
  )

  // delete prop
  updated = updated.delete_predicate('prop')
  updated = updated.delete_predicate('/ancestors.region.reported.name')
  updated = updated.delete_predicate('/ancestors.cloud.reported.name')
  assert.strictEqual(updated.toString(), 'is(foo) and /ancestors.account.reported.name == "test"')

  // update is
  updated = updated.set_is(['bar'])
  assert.strictEqual(updated.toString(), 'is(bar) and /ancestors.account.reported.name == "test"')
  updated = updated.delete_is()
  assert.strictEqual(updated.toString(), '/ancestors.account.reported.name == "test"')
  updated = updated.set_is(['boo', 'bla'])
  assert.strictEqual(updated.toString(), 'is(boo, bla) and /ancestors.account.reported.name == "test"')

  // original query should not be modified
  assert.strictEqual(query.toString(), q)
})

test('find paths', () => {
  let jso: object = { a: 12, b: 21 }
  let all_paths = [...Path.from_string('a').find_path(jso)]
  assert.deepEqual(all_paths, [[Path.from('a'), 12]])

  jso = { a: [{ b: [{ c: 21 }, { c: 22 }] }, { b: [{ c: 21 }, { c: 22 }] }] }
  all_paths = [...Path.from_string('a[*].b[*].c').find_path(jso)]
  assert.deepEqual(all_paths, [
    [Path.from_string('a[0].b[0].c'), 21],
    [Path.from_string('a[0].b[1].c'), 22],
    [Path.from_string('a[1].b[0].c'), 21],
    [Path.from_string('a[1].b[1].c'), 22],
  ])
})

test('find matching path', () => {
  // simple top level property
  let js: object = { a: 1, prop: 42, b: 2 }
  assert.deepEqual(Query.parse('prop == 42').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop > 12').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop >= 12').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop < 45').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop <= 45').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop != 45').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop =~ 4.').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop ~ ".."').find_matching(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop > 43').find_matching(js), [])
  assert.deepEqual(Query.parse('prop < 42').find_matching(js), [])
  assert.deepEqual(js, { a: 1, prop: 42, b: 2 })

  // nested property with array
  const nested_array_predicate = Query.parse('foo[*].bla[*].bar[*].prop > 1')
  js = {
    a: 1,
    foo: [
      {
        bla: [
          { bar: [{ prop: 42, some: 1, other: 2 }] },
          {
            bar: [
              { prop: 42, some: 1, other: 2 },
              { prop: 42, some: 1, other: 2 },
            ],
          },
        ],
      },
      { bla: [{ bar: [{ prop: 42, some: 1, other: 2 }] }] },
    ],
    b: 2,
  }
  const paths = nested_array_predicate.find_matching(js)
  assert.deepEqual(paths, [
    Path.from_string('foo[0].bla[0].bar[0].prop'),
    Path.from_string('foo[0].bla[1].bar[0].prop'),
    Path.from_string('foo[0].bla[1].bar[1].prop'),
    Path.from_string('foo[1].bla[0].bar[0].prop'),
  ])
})
test('Changing resource json: predicate', () => {
  // simple top level property
  let js: object = { a: 1, prop: 42, b: 2 }
  assert.deepEqual(Query.parse('prop == 42').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop > 12').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop >= 12').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop < 45').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop <= 45').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop != 45').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop =~ 4.').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop ~ ".."').delete_matching(js), { a: 1, b: 2 })
  assert.deepEqual(Query.parse('prop > 43').delete_matching(js), js)
  assert.deepEqual(Query.parse('prop < 42').delete_matching(js), js)
  assert.deepEqual(js, { a: 1, prop: 42, b: 2 })

  // nested property
  const nested_predicate = Query.parse('foo.bla.bar.prop == 42')
  js = { a: 1, foo: { bla: { bar: { prop: 42, some: 1, other: 2 } } }, b: 2 }
  let result: JsonElement = nested_predicate.delete_matching(js)
  assert.deepEqual(result, { a: 1, b: 2, foo: { bla: { bar: { some: 1, other: 2 } } } })
  assert.deepEqual(js, { a: 1, foo: { bla: { bar: { prop: 42, some: 1, other: 2 } } }, b: 2 })

  // nested property with array
  const nested_array_predicate = Query.parse('foo[*].bla[*].bar[*].prop > 1')
  js = {
    a: 1,
    foo: [
      {
        bla: [
          { bar: [{ prop: 42, some: 1, other: 2 }] },
          {
            bar: [
              { prop: 42, some: 1, other: 2 },
              { prop: 42, some: 1, other: 2 },
            ],
          },
        ],
      },
      { bla: [{ bar: [{ prop: 42, some: 1, other: 2 }] }] },
    ],
    b: 2,
  }
  result = nested_array_predicate.delete_matching(js)
  assert.deepEqual(result, {
    a: 1,
    foo: [
      {
        bla: [
          { bar: [{ some: 1, other: 2 }] },
          {
            bar: [
              { some: 1, other: 2 },
              { some: 1, other: 2 },
            ],
          },
        ],
      },
      { bla: [{ bar: [{ some: 1, other: 2 }] }] },
    ],
    b: 2,
  })
})

test('Changing resource json: context term', () => {
  // simple top level property
  const js: object = { a: 1, b: 2, c: { d: { e: { f: [{ g: 1, h: 2 }] } } } }
  assert.deepEqual(Query.parse('c.d.e.f[*].{g>0 and h<3}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{}] } } } })
  assert.deepEqual(Query.parse('c.d.e.f[*].{g>0 or h<3}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{}] } } } })
  assert.deepEqual(Query.parse('c.d.e.f[*].{g>0 or h>3}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{ h: 2 }] } } } })
  assert.deepEqual(Query.parse('c.d.e.f[*].{g<0 or (g>0 and h<3)}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{}] } } } })
})

test('Find and change', () => {
  const js = { a: 1, b: [1, 2, 3, 4], c: { d: { e: { f: [{ g: 1, h: 2 }] } } } }

  let draft = new JsonElementDraft(js)
  for (const m of draft.find_path(Path.from_string('c.d.e.f[*].g'))) m.set(42)
  assert.deepEqual(draft.final_value, { a: 1, b: [1, 2, 3, 4], c: { d: { e: { f: [{ g: 42, h: 2 }] } } } })

  draft = new JsonElementDraft(js)
  for (const m of draft.find_path(Path.from_string('c.d.e.f[*].g'))) m.delete()
  assert.deepEqual(draft.final_value, { a: 1, b: [1, 2, 3, 4], c: { d: { e: { f: [{ h: 2 }] } } } })

  draft = new JsonElementDraft(js)
  for (const m of draft.find_path(Path.from_string('c'))) m.delete()
  for (const m of draft.find_path(Path.from_string('b[*]'))) m.delete()
  assert.deepEqual(draft.final_value, { a: 1, b: [] })

  draft = new JsonElementDraft(js)
  for (const m of draft.find_path(Path.from_string('c'))) m.delete()
  for (const m of draft.find_path(Path.from_string('b'))) m.delete()
  assert.deepEqual(draft.final_value, { a: 1 })

  draft = new JsonElementDraft(js)
  for (const m of draft.find_path(Path.from_string('c'))) m.delete()
  for (const m of draft.find_path(Path.from_string('b[*]'))) m.set(23)
  assert.deepEqual(draft.final_value, { a: 1, b: [23, 23, 23, 23] })

  draft = new JsonElementDraft(js)
  for (const m of draft.find_path(Path.from_string('c'))) m.delete()
  for (const m of draft.find_path(Path.from_string('b[1]'))) m.set(23)
  assert.deepEqual(draft.final_value, { a: 1, b: [1, 23, 3, 4] })

  draft = new JsonElementDraft({ t: [js, js] })
  for (const m of draft.find_path(Path.from_string('t[*].c'))) m.delete()
  assert.deepEqual(draft.final_value, {
    t: [
      { a: 1, b: [1, 2, 3, 4] },
      { a: 1, b: [1, 2, 3, 4] },
    ],
  })
})

test('Indicate if a query can derive data from resource json', () => {
  const queries: Array<[string, boolean]> = [
    ['is(aws_lambda_function) with (empty, <-- is(aws_vpc))', false],
    ['is(aws_lambda_function) and function_url_config.cors.allow_origins ~ "*"', true],
    ['is(aws_lambda_function) and function_runtime in [python3.6, python2.7, dotnetcore2.1, ruby2.5]', true],
    ['foo.bla.bar[*].{test in [python3.6, python2.7, dotnetcore2.1, ruby2.5] or rest==42}', true],
    ['is(foo) --> is(bla)', false],
    ['is(foo) {test: -->}', false],
  ]
  for (const [query, details] of queries) {
    assert.strictEqual(Query.parse(query).provides_security_check_details(), details)
  }
})
