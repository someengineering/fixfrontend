import { getMaterialColorBySeverity } from './getMaterialColorBySeverity'
import { materialColorsBySeverity } from './materialColorsBySeverity'

test('getMaterialColorBySeverity should return correct color based on severity', () => {
  const critical = getMaterialColorBySeverity('critical')
  const high = getMaterialColorBySeverity('high')
  const medium = getMaterialColorBySeverity('medium')
  const low = getMaterialColorBySeverity('low')
  const info = getMaterialColorBySeverity('info')
  const passed = getMaterialColorBySeverity('passed')
  const CRITICAL = getMaterialColorBySeverity('CRITICAL')
  const unknown = getMaterialColorBySeverity('unknown')
  expect(critical).toBe(materialColorsBySeverity.Critical)
  expect(high).toBe(materialColorsBySeverity.High)
  expect(medium).toBe(materialColorsBySeverity.Medium)
  expect(low).toBe(materialColorsBySeverity.Low)
  expect(info).toBe(materialColorsBySeverity.Info)
  expect(passed).toBe(materialColorsBySeverity.Passed)
  expect(CRITICAL).toBe(materialColorsBySeverity.Critical)
  expect(unknown).toBe(materialColorsBySeverity.Info)
})
