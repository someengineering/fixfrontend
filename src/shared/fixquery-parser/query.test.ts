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
