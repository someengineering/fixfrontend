/* eslint-disable @typescript-eslint/no-misused-promises */
import { MockMethod } from 'vite-plugin-mock'
import { responseJSONWithAuthCheck } from './utils'

const workspaces = (): MockMethod[] => {
  return [
    // list
    {
      url: '/api/workspaces/',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck([
        {
          id: '00000000-0000-0000-0000-000000000000',
          members: ['00000000-0000-0000-0000-000000000000'],
          name: 'My Organization',
          owners: ['00000000-0000-0000-0000-000000000000'],
          slug: 'my-org',
        },
      ]),
    },
    // cf_url
    {
      url: '/api/workspaces/:wordspaceid/cf_url',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck(
        'https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?templateURL=https://fixpublic.s3.amazonaws.com/aws/fix-role-dev-eu.yaml&stackName=FixAccess&param_WorkspaceId=715528a6-ebc1-455f-bda3-bccaf8dc042b&param_ExternalId=5c671b17-ba88-4785-8b64-09a3998b8f33',
      ),
    },
    // cf_template
    {
      url: '/api/workspaces/:wordspaceid/cf_template',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck('https://fixpublic.s3.amazonaws.com/aws/fix-role-dev-eu.yaml'),
    },
    // external_id
    {
      url: '/api/workspaces/:wordspaceid/external_id',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck({
        external_id: '00000000-0000-0000-0000-000000000000',
      }),
    },
  ]
}

export default workspaces
