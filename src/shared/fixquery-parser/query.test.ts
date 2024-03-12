import assert from 'assert'
import { Query } from './query.ts'

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
