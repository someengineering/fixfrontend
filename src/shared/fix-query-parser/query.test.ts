import assert from 'assert'
import { AllTerm, FulltextTerm, JsonElement, JsonElementDraft, Path, Predicate, Query } from './query.ts'

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

test('Combine terms', () => {
  const left = new FulltextTerm({ text: 'foo' })
  const right = new Predicate({ path: Path.from_string('prop'), op: '==', value: 42 })
  const all = new AllTerm()
  assert.strictEqual(left.and_term(all), left)
  assert.strictEqual(left.or_term(all), all)
  assert.strictEqual(left.and_term(right).toString(), '"foo" and prop == 42')
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

test('delete predicate in context', () => {
  const query = Query.parse('is(foo) and some[*].nested[*].{ prop == 42 and foo == "aws" and bla == "test"}')
  const p1 = query.delete_predicate('prop')
  assert.strictEqual(p1.toString(), 'is(foo) and some[*].nested[*].{foo == "aws" and bla == "test"}')
  const p2 = p1.delete_predicate('foo')
  assert.strictEqual(p2.toString(), 'is(foo) and some[*].nested[*].{bla == "test"}')
  const p3 = p2.delete_predicate('bla')
  assert.strictEqual(p3.toString(), 'is(foo)')
})

test('find paths', () => {
  let jso: JsonElement = { a: 12, b: 21 }
  let all_paths = [...Path.from_string('a').find(jso)]
  assert.deepEqual(all_paths, [[Path.from('a'), 12]])

  jso = { a: [{ b: [{ c: 21 }, { c: 22 }] }, { b: [{ c: 21 }, { c: 22 }] }] }
  all_paths = [...Path.from_string('a[*].b[*].c').find(jso)]
  assert.deepEqual(all_paths, [
    [Path.from_string('a[0].b[0].c'), 21],
    [Path.from_string('a[0].b[1].c'), 22],
    [Path.from_string('a[1].b[0].c'), 21],
    [Path.from_string('a[1].b[1].c'), 22],
  ])
})

test('find matching path', () => {
  // simple top level property
  let js: JsonElement = { a: 1, prop: 42, b: 2 }
  assert.deepEqual(Query.parse('prop == 42').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop > 12').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop >= 12').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop < 45').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop <= 45').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop != 45').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop =~ 4.').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop ~ ".."').find_paths(js), [Path.from('prop')])
  assert.deepEqual(Query.parse('prop > 43').find_paths(js), [])
  assert.deepEqual(Query.parse('prop < 42').find_paths(js), [])
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
  const paths = nested_array_predicate.find_paths(js)
  assert.deepEqual(paths, [
    Path.from_string('foo[0].bla[0].bar[0].prop'),
    Path.from_string('foo[0].bla[1].bar[0].prop'),
    Path.from_string('foo[0].bla[1].bar[1].prop'),
    Path.from_string('foo[1].bla[0].bar[0].prop'),
  ])
})
test('Changing resource json: predicate', () => {
  // simple top level property
  let js: JsonElement = { a: 1, prop: 42, b: 2 }
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
  const js = { a: 1, b: 2, c: { d: { e: { f: [{ g: 1, h: 2 }] } } } }
  assert.deepEqual(Query.parse('c.d.e.f[*].{g>0 and h<3}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{}] } } } })
  assert.deepEqual(Query.parse('c.d.e.f[*].{g>0 or h<3}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{}] } } } })
  assert.deepEqual(Query.parse('c.d.e.f[*].{g>0 or h>3}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{ h: 2 }] } } } })
  assert.deepEqual(Query.parse('c.d.e.f[*].{g<0 or (g>0 and h<3)}').delete_matching(js), { a: 1, b: 2, c: { d: { e: { f: [{}] } } } })
})

test('Find and change', () => {
  const js = { a: 1, b: [1, 2, 3, 4], c: { d: { e: { f: [{ g: 1, h: 2 }] } } } }

  let draft = new JsonElementDraft(js)
  for (const m of draft.find(Path.from_string('c.d.e.f[*].g'))) m.set(42)
  assert.deepEqual(draft.final_value, { a: 1, b: [1, 2, 3, 4], c: { d: { e: { f: [{ g: 42, h: 2 }] } } } })

  draft = new JsonElementDraft(js)
  for (const m of draft.find(Path.from_string('c.d.e.f[*].g'))) m.delete()
  assert.deepEqual(draft.final_value, { a: 1, b: [1, 2, 3, 4], c: { d: { e: { f: [{ h: 2 }] } } } })

  draft = new JsonElementDraft(js)
  for (const m of draft.find(Path.from_string('c'))) m.delete()
  for (const m of draft.find(Path.from_string('b[*]'))) m.delete()
  assert.deepEqual(draft.final_value, { a: 1, b: [] })

  draft = new JsonElementDraft(js)
  for (const m of draft.find(Path.from_string('c'))) m.delete()
  for (const m of draft.find(Path.from_string('b'))) m.delete()
  assert.deepEqual(draft.final_value, { a: 1 })

  draft = new JsonElementDraft(js)
  for (const m of draft.find(Path.from_string('c'))) m.delete()
  for (const m of draft.find(Path.from_string('b[*]'))) m.set(23)
  assert.deepEqual(draft.final_value, { a: 1, b: [23, 23, 23, 23] })

  draft = new JsonElementDraft(js)
  for (const m of draft.find(Path.from_string('c'))) m.delete()
  for (const m of draft.find(Path.from_string('b[1]'))) m.set(23)
  assert.deepEqual(draft.final_value, { a: 1, b: [1, 23, 3, 4] })

  draft = new JsonElementDraft({ t: [js, js] })
  for (const m of draft.find(Path.from_string('t[*].c'))) m.delete()
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

test('real world example', () => {
  let resource: JsonElement = { ctime: '2023-02-02T04:27:03Z', access_key_last_used: { last_used: '2023-02-26T17:39:00Z' } }
  let query = Query.parse(
    'is(aws_iam_access_key) and age>{{access_key_too_old_age}} and (access_key_last_used.last_used==null or access_key_last_used.last_used<{{access_key_too_old_age.ago}})',
    { access_key_too_old_age: '90d' },
  )
  assert.deepEqual(query.find_paths(resource), [Path.from_string('ctime'), Path.from_string('access_key_last_used.last_used')])

  resource = { max_password_age: 120 }
  query = Query.parse('is(aws_account) and (expire_passwords!=true or max_password_age>{{password_age}})', { password_age: 90 })
  assert.deepEqual(query.find_paths(resource), [Path.from_string('expire_passwords'), Path.from_string('max_password_age')])

  resource = { max_password_age: 20 }
  query = Query.parse('is(aws_account) and (expire_passwords!=true or max_password_age>{{password_age}})', { password_age: 90 })
  assert.deepEqual(query.find_paths(resource), [Path.from_string('expire_passwords')])

  query = Query.parse('foo==all')
  assert.strictEqual(query.toString(), 'foo == "all"')
})

test('fulltext searches', () => {
  const query = Query.parse(
    'is(aws) and access_key_last_used.last_used==null and "whatever" and age>90d and /ancestors.account.reported.name == "test" and "deleteme"',
  )
  const noFulltextQuery = Query.parse('access_key_last_used.last_used==null')
  assert.strictEqual(
    query
      .fulltexts()
      .map((i) => i.text)
      .join(','),
    'whatever,deleteme',
  )
  assert.strictEqual(
    noFulltextQuery
      .fulltexts()
      .map((i) => i.text)
      .join(','),
    '',
  )
})

test('set fulltext search', () => {
  const query = Query.parse(
    'is(aws) and access_key_last_used.last_used==null and "whatever" and age>90d and /ancestors.account.reported.name == "test" and "deleteme"',
  )
  const noFulltextQuery = Query.parse('access_key_last_used.last_used==null')
  const testAddWithValue = query.update_fulltext('something')
  const testReplaceWithValue = query.update_fulltext('something', 'whatever')
  // no fulltext
  const testEmptyAddWithValue = noFulltextQuery.update_fulltext('something')
  const testEmptyReplaceWithValue = noFulltextQuery.update_fulltext('something', 'whatever')
  //asserts full texts
  assert.strictEqual(
    testAddWithValue
      .fulltexts()
      .map((i) => i.text)
      .join(','),
    'something,whatever,deleteme',
  )
  assert.strictEqual(
    testReplaceWithValue
      .fulltexts()
      .map((i) => i.text)
      .join(','),
    'something,deleteme',
  )
  //asserts query
  assert.strictEqual(
    testAddWithValue.toString(),
    '"something" and is(aws) and access_key_last_used.last_used == null and "whatever" and age > "90d" and /ancestors.account.reported.name == "test" and "deleteme"',
  )
  assert.strictEqual(
    testReplaceWithValue.toString(),
    'is(aws) and access_key_last_used.last_used == null and "something" and age > "90d" and /ancestors.account.reported.name == "test" and "deleteme"',
  )
  //asserts empties full texts
  assert.strictEqual(
    testEmptyAddWithValue
      .fulltexts()
      .map((i) => i.text)
      .join(','),
    'something',
  )
  assert.strictEqual(
    testEmptyReplaceWithValue
      .fulltexts()
      .map((i) => i.text)
      .join(','),
    'something',
  )
  //asserts empties query
  assert.strictEqual(testEmptyAddWithValue.toString(), '"something" and access_key_last_used.last_used == null')
  assert.strictEqual(testEmptyReplaceWithValue.toString(), '"something" and access_key_last_used.last_used == null')
})

test('get and update properties when navigation is defined', () => {
  const q1 = Query.parse('is(foo) and bla=true -->')
  const terms = q1.ui_terms(() => true)
  assert.deepEqual(terms, [])
  const q2 = q1.set_predicate('bla', '==', 'bar')
  assert.strictEqual(q2.toString(), 'is(foo) and bla = true --> bla == "bar"')
  const q3 = q2.set_predicate('bla', '==', 'boom')
  assert.strictEqual(q3.toString(), 'is(foo) and bla = true --> bla == "boom"')
})
