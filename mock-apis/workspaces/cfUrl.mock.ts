/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // cf_url
  url: '/api/workspaces/:workspaceId/cf_url',
  method: 'GET',
  response: responseJSONWithAuthCheck(
    'https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?templateURL=https://fixpublic.s3.amazonaws.com/aws/fix-role-dev-eu.yaml&stackName=FixAccess&param_WorkspaceId=715528a6-ebc1-455f-bda3-bccaf8dc042b&param_ExternalId=5c671b17-ba88-4785-8b64-09a3998b8f33',
  ),
})
