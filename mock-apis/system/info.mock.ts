import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  // info
  url: '/api/info',
  method: 'GET',
  body: { environment: 'dev', aws_marketplace_url: 'https://aws_marketplace_url.test' },
})
