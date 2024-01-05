import { isValidProp } from './isValidProp'

test('isValidProp should return whether or not the prop is valid', () => {
  const valid = isValidProp('validProp1')
  const invalid = isValidProp('invalid-prop')
  expect(valid).toBe(true)
  expect(invalid).toBe(false)
})
