import { scoreToStaticColor } from './scoreToStaticColor'

test('scoreToStaticColor should give color passing the score', () => {
  const errorScore = 50
  const warningScore = 90
  const successScore = 100
  const infoScore = 0
  const error = scoreToStaticColor(errorScore)
  const warning = scoreToStaticColor(warningScore)
  const success = scoreToStaticColor(successScore)
  const info = scoreToStaticColor(infoScore)
  expect(error).toBe('error')
  expect(warning).toBe('warning')
  expect(success).toBe('success')
  expect(info).toBe('info')
})
