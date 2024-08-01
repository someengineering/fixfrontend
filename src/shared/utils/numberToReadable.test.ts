import { numberToReadable } from './numberToReadable'

test('numberToReadable should get the number in human readable way', () => {
  const units = ['A', 'B', 'C', 'D', 'E', 'F']
  const locale = 'en-US'
  const number = 123
  const thousandNumber = 123_456
  const millionNumber = 123_456_789
  const billionNumber = 123_456_789_123
  const trillionNumber = 123_456_789_123_456
  const wayTooHighNumber = 1_234_567_891_234_567
  const wayTooHighNumberNegative = -1_234_567_891_234_567
  const numberReadable = numberToReadable({ value: number, units, locale })
  const thousandNumberReadable = numberToReadable({ value: thousandNumber, units, locale })
  const millionNumberReadable = numberToReadable({ value: millionNumber, units, locale })
  const billionNumberReadable = numberToReadable({ value: billionNumber, units, locale })
  const trillionNumberReadable = numberToReadable({ value: trillionNumber, units, locale })
  const wayTooHighNumberReadable = numberToReadable({ value: wayTooHighNumber, units, locale })
  const wayTooHighNumberNegativeReadable = numberToReadable({ value: wayTooHighNumberNegative, units, locale })
  const wayTooHighNumberReadableWithMaximumFraction = numberToReadable({
    value: wayTooHighNumber,
    units,
    locale,
    maximumFractions: 4,
  })
  const wayTooHighNumberReadableWithMaximumDigits = numberToReadable({
    value: wayTooHighNumber,
    units,
    locale,
    maximumDigits: 6,
    maximumFractions: 6,
  })
  const wayTooHighNumberNegativeReadableWithMaximumDigits = numberToReadable({
    value: wayTooHighNumberNegative,
    units,
    locale,
    maximumDigits: 6,
    maximumFractions: 6,
  })
  expect(numberReadable).toBe('123A')
  expect(thousandNumberReadable).toBe('123B')
  expect(millionNumberReadable).toBe('123C')
  expect(billionNumberReadable).toBe('123D')
  expect(trillionNumberReadable).toBe('123E')
  expect(wayTooHighNumberReadable).toBe('1F')
  expect(wayTooHighNumberNegativeReadable).toBe('-1F')
  expect(wayTooHighNumberReadableWithMaximumFraction).toBe('1.23F')
  expect(wayTooHighNumberReadableWithMaximumDigits).toBe('1.23457F')
  expect(wayTooHighNumberNegativeReadableWithMaximumDigits).toBe('-1.23457F')
})
