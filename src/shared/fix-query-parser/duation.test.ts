import { parse_duration } from './duration.ts'

test('Parse duration', () => {
  assert.deepEqual(parse_duration('1s'), 1)
  assert.deepEqual(parse_duration('90d'), 7776000)
  assert.deepEqual(parse_duration('23d25m12s'), 1988712)
  assert.deepEqual(parse_duration('23d and 25m and 12s'), 1988712)
  assert.deepEqual(parse_duration('23d,25m,12s'), 1988712)
  assert.deepEqual(parse_duration('23d, 25m, 12s'), 1988712)
})
