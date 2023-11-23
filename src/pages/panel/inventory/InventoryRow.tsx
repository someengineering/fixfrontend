import { ButtonBase, ButtonBaseProps, TableCell, TableRow } from '@mui/material'
import { panelUI } from 'src/shared/constants'
import { GetWorkspaceInventorySearchTableColumn, GetWorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { rowStrFromColumnKind } from './utils'

interface InventoryRowProps {
  row: GetWorkspaceInventorySearchTableRow
  columns: GetWorkspaceInventorySearchTableColumn[]
  onClick: (params: GetWorkspaceInventorySearchTableRow) => void
}

export const InventoryRow = ({ row, columns, onClick }: InventoryRowProps) => {
  const handleClick = () => {
    onClick(row)
  }

  return (
    <ButtonBase
      sx={{ display: 'table-row' }}
      TouchRippleProps={{ as: 'td' } as unknown as ButtonBaseProps['TouchRippleProps']}
      component={TableRow}
      onClick={handleClick}
    >
      {columns.map((column, i) => (
        <TableCell key={`${column.name}-${row.id}-${i}`} sx={{ minWidth: panelUI.inventoryTableCellMinWidth }}>
          {rowStrFromColumnKind(row.row[column.name], column.kind) ?? '-'}
        </TableCell>
      ))}
    </ButtonBase>
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
