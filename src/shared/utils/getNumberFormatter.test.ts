import { getNumberFormatter } from './getNumberFormatter'

test('getNumberFormatter should format correctly', () => {
  const usNumberFormatter = getNumberFormatter('en-US')
  const deNumberFormatter = getNumberFormatter('de-DE')
  const simpleUS = usNumberFormatter(123456)
  const simpleDE = deNumberFormatter(123456)
  const nullUS = usNumberFormatter(null)
  const nullDE = deNumberFormatter(null)
  expect(simpleUS).toBe('123,456')
  expect(simpleDE).toBe('123.456')
  expect(nullUS).toBe('-')
  expect(nullDE).toBe('-')
})
