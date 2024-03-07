import assert from 'assert'
import { FixQuery } from './FixQuery.ts'

test('Parse existing queries', () => {
  const query = FixQuery.parse(
    'is(foo) and prop==42 and /ancestors.cloud.reported.name=="aws" and /ancestors.account.reported.name=="test" and /ancestors.region.reported.name="us-east-1" and (tags.agent==42 or tags.foo="bla") and /security.severity in ["high","critical"]',
  )
  assert.strictEqual(query.predicates().length, 7)
  assert.strictEqual(query.cloud!.value, 'aws')
  assert.strictEqual(query.account!.value, 'test')
  assert.deepEqual(query.tags, { 'tags.agent': 42, 'tags.foo': 'bla' })
  assert.deepEqual(query.severity!.value, ['high', 'critical'])
  assert.deepEqual(query.remainingPredicates, { prop: 42 })
})
