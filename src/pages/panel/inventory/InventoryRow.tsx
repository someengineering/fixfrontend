import { TableCell, TableRow } from '@mui/material'
import { panelUI } from 'src/shared/constants'
import { GetWorkspaceInventorySearchTableColumn, GetWorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { rowStrFromColumnKind } from './utils'

interface InventoryRowProps {
  row: GetWorkspaceInventorySearchTableRow
  columns: GetWorkspaceInventorySearchTableColumn[]
}

export const InventoryRow = ({ row, columns }: InventoryRowProps) => {
  return (
    <TableRow>
      {columns.map((column, i) => (
        <TableCell key={`${column.name}-${row.id}-${i}`} sx={{ minWidth: panelUI.inventoryTableCellMinWidth }}>
          {rowStrFromColumnKind(row.row[column.name], column.kind) ?? '-'}
        </TableCell>
      ))}
    </TableRow>
  )
}

export const InventoryRowSkleton = ({ row, columns }: InventoryRowProps) => {
  return (
    <TableRow>
      {columns.map((column, i) => (
        <TableCell key={`${column.name}-${row.id}-${i}`}>{rowStrFromColumnKind(row.row[column.name], column.kind) ?? '-'}</TableCell>
      ))}
    </TableRow>
  )
}
