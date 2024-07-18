import { WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'

export const allHistoryChangesOptions: readonly WorkspaceInventorySearchTableHistoryChanges[] = [
  'node_compliant',
  'node_created',
  'node_deleted',
  'node_updated',
  'node_vulnerable',
]
