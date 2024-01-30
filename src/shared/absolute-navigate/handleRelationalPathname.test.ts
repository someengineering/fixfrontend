import { handleRelationalPathname } from './handleRelationalPathname'

const testPathname = '/test1/test2/test3/test4'

beforeEach(() => {
  window.location.pathname = testPathname
})

afterEach(() => {
  window.location.pathname = '/'
})

test('handleRelationalPathname should handle relation pathname', () => {
  const result1 = handleRelationalPathname('.')
  const result2 = handleRelationalPathname('./')
  const result3 = handleRelationalPathname('./test')
  const result4 = handleRelationalPathname('../')
  const result5 = handleRelationalPathname('../test')
  const result6 = handleRelationalPathname('../../')
  const result7 = handleRelationalPathname('../../test')
  const result8 = handleRelationalPathname('../../../test')
  const result9 = handleRelationalPathname('../../../../test')
  const result10 = handleRelationalPathname('/test')
  const result11 = handleRelationalPathname('whatever')
  expect(result1).toBe(testPathname)
  expect(result2).toBe(testPathname + '/')
  expect(result3).toBe(testPathname + '/test')
  expect(result4).toBe('/test1/test2/test3/')
  expect(result5).toBe('/test1/test2/test3/test')
  expect(result6).toBe('/test1/test2/')
  expect(result7).toBe('/test1/test2/test')
  expect(result8).toBe('/test1/test')
  expect(result9).toBe('/test')
  expect(result10).toBe('/test')
  expect(result11).toBe('whatever')
})
