import { checkDiff } from './checkDiff'

test('checkDiff should give back difference between scores', () => {
  const diff = checkDiff({ critical: 4, high: 4, medium: 4, low: 4 }, { critical: 5, high: 5, medium: 5, low: 5 }, 36)
  expect(diff).toBe(-7)
})
