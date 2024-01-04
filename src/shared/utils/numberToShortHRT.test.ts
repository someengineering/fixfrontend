import { numberToShortHRT } from './numberToShortHRT'

test('numberToShortHRT should get the number in human readable way', () => {
  const number = 123
  const thousandNumber = 123_456
  const millionNumber = 123_456_789
  const billionNumber = 123_456_789_123
  const trillionNumber = 123_456_789_123_456
  const wayTooHighNumber = 1_234_567_891_234_567
  const numberShortHRT = numberToShortHRT(number)
  const thousandNumberShortHRT = numberToShortHRT(thousandNumber)
  const millionNumberShortHRT = numberToShortHRT(millionNumber)
  const billionNumberShortHRT = numberToShortHRT(billionNumber)
  const trillionNumberShortHRT = numberToShortHRT(trillionNumber)
  const wayTooHighNumberShortHRT = numberToShortHRT(wayTooHighNumber)
  expect(numberShortHRT).toBe('123')
  expect(thousandNumberShortHRT).toBe('123K')
  expect(millionNumberShortHRT).toBe('123M')
  expect(billionNumberShortHRT).toBe('123B')
  expect(trillionNumberShortHRT).toBe('123T')
  expect(wayTooHighNumberShortHRT).toBe(':)')
})
