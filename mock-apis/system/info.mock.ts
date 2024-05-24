import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  // info
  url: '/api/info',
  method: 'GET',
  body: { environment: 'dev' },
})
