import { Account } from 'src/shared/types/server-shared'
import { getAccountName } from './getAccountName'

test('getAccountName should get account names in a correct order fashion', () => {
  const account = {
    account_id: '',
    api_account_alias: 'alias',
    api_account_name: null,
    cloud: '',
    enabled: false,
    id: '',
    is_configured: false,
    last_scan_finished_at: null,
    last_scan_started_at: null,
    next_scan: null,
    privileged: false,
    resources: null,
    state: '',
    user_account_name: null,
  } as Account
  const apiAccount = { ...account, api_account_name: 'api' }
  const userAccount = { ...account, user_account_name: 'user' }
  const alias = getAccountName(account)
  const api = getAccountName(apiAccount)
  const user = getAccountName(userAccount)
  expect(alias).toBe('alias')
  expect(api).toBe('api')
  expect(user).toBe('user')
})
