import { Account } from './shared'

export type GetWorkspaceCloudAccountsResponse = {
  added: Account[]
  discovered: Account[]
  recent: Account[]
}
