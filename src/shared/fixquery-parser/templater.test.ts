import { render } from './templater.ts'

test('Render a simple template', () => {
  const data = { name: 'Batman', duration: '90d' }
  const now = new Date()
  now.setSeconds(now.getSeconds() + 7776000)
  const expected = `Hello Batman: 90d is at ${now.toISOString()}`.substring(0, 43) // cut millis
  expect(render('Hello {{name}}: {{duration}} is at {{duration.from_now}}', data).startsWith(expected))
})
