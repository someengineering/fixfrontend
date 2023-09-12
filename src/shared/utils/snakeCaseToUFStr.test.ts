import { snakeCaseToUFStr } from './snakeCaseToUFStr'

test('check snake case to user friendly string', () => {
  const name = 'this-is-a-test'
  const enhancedName = snakeCaseToUFStr(name)
  expect(enhancedName).toBe('This is a test')
})
