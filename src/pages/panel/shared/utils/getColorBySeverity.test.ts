import { colorsBySeverity } from './colorsBySeverity'
import { getColorBySeverity } from './getColorBySeverity'

test('getColorBySeverity should return correct color based on severity', () => {
  const critical = getColorBySeverity('critical')
  const high = getColorBySeverity('high')
  const medium = getColorBySeverity('medium')
  const low = getColorBySeverity('low')
  const info = getColorBySeverity('info')
  const passed = getColorBySeverity('passed')
  const CRITICAL = getColorBySeverity('CRITICAL')
  const unknown = getColorBySeverity('unknown')
  expect(critical).toBe(colorsBySeverity.Critical)
  expect(high).toBe(colorsBySeverity.High)
  expect(medium).toBe(colorsBySeverity.Medium)
  expect(low).toBe(colorsBySeverity.Low)
  expect(info).toBe(colorsBySeverity.Info)
  expect(passed).toBe(colorsBySeverity.Passed)
  expect(CRITICAL).toBe(colorsBySeverity.Critical)
  expect(unknown).toBe(colorsBySeverity.Info)
})
