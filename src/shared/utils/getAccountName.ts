import { Account } from 'src/shared/types/server-shared'

export const getAccountName = (account: Account) => account.user_account_name || account.api_account_name || account.api_account_alias
