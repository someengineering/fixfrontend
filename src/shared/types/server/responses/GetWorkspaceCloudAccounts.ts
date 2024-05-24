import { Account } from 'src/shared/types/server-shared'

export type GetWorkspaceCloudAccountsResponse = {
  added: Account[]
  discovered: Account[]
  recent: Account[]
}
