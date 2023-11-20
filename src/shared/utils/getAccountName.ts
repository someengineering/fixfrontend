import { Account } from 'src/shared/types/server'

export const getAccountName = (account: Account) => account.user_account_name || account.api_account_name || account.api_account_alias
