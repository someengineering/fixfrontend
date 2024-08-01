import { WorkspaceInventorySearchTableColumn } from 'src/shared/types/server'

export const inventoryTableCellHasIcon = (col: WorkspaceInventorySearchTableColumn) => {
  switch (col.kind) {
    case 'boolean':
      return true
  }
  switch (col.path) {
    case '/ancestors.cloud.reported.name':
    case '/ancestors.cloud.reported.id':
      return true
    case '/change':
      return true
  }
  return false
}
