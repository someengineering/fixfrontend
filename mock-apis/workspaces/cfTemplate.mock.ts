/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // cf_template
  url: '/api/workspaces/:workspaceId/cf_template',
  method: 'GET',
  response: responseJSONWithAuthCheck('https://fixpublic.s3.amazonaws.com/aws/fix-role-dev-eu.yaml'),
})
