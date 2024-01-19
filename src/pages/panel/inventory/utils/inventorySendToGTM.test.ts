import { AxiosError, AxiosHeaders } from 'axios'
import { GTMEventNames } from 'src/shared/constants'
// eslint-disable-next-line no-restricted-imports
import { setGTMDispatch } from 'src/shared/google-tag-manager/gtmDispatch'
import { inventorySendToGTM } from './inventorySendToGTM'

test('inventorySendToGTM should send to GTM correctly', () => {
  const spy = vi.fn()
  setGTMDispatch(spy)
  const params = {}
  const headers = new AxiosHeaders('')
  const config = { config: { headers }, data: null, headers, status: 500, statusText: 'InternalError' }
  const err = new AxiosError('message', '500', { headers }, {}, config)
  inventorySendToGTM('postWorkspaceInventoryNodeQuery', true, err, params, 'id')
  expect(spy).toHaveBeenCalledOnce()
  expect(spy).toBeCalledWith({
    event: GTMEventNames.InventoryError,
    api: 'api/workspaces/unknown/inventory/node/id',
    authorized: false,
    isAdvanceSearch: true,
    params,
    name: err.name,
    stack: err.stack,
    message: err.message,
    request: '{}',
    response: JSON.stringify(config),
    status: '',
    workspaceId: 'unknown',
  })
  setGTMDispatch((_) => {})
})
