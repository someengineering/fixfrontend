import { getArrayFromInOP } from './getArrayFromInOP'

test('getArrayFromInOP should get array from the array of values in searchCrit', () => {
  const arr = getArrayFromInOP("[value1,2,'something']")
  expect(arr[0]).toBe('value1')
  expect(arr[1]).toBe('2')
  expect(arr[2]).toBe("'something'")
})
