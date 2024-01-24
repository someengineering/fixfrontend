import CheckIcon from '@mui/icons-material/Check'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import { ButtonBase, ButtonBaseProps, TableCell, TableRow } from '@mui/material'
import { PostWorkspaceInventorySearchTableColumn, PostWorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { rowStrFromColumnKind } from './utils'

interface InventoryRowProps {
  row: PostWorkspaceInventorySearchTableRow
  columns: PostWorkspaceInventorySearchTableColumn[]
  onClick: (params: PostWorkspaceInventorySearchTableRow) => void
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
        <TableCell key={`${column.name}-${row.id}-${i}`} sx={{ whiteSpace: 'nowrap' }}>
          {typeof row.row[column.name] === 'boolean' ? (
            row.row[column.name] ? (
              <CheckIcon color="success" />
            ) : (
              <DoDisturbIcon color="error" />
            )
          ) : (
            rowStrFromColumnKind(row.row[column.name], column.kind) ?? '-'
          )}
        </TableCell>
      ))}
    </ButtonBase>
  )
}

export const InventoryRowSkeleton = ({ row, columns }: InventoryRowProps) => {
  return (
    <TableRow>
      {columns.map((column, i) => (
        <TableCell key={`${column.name}-${row.id}-${i}`}>{rowStrFromColumnKind(row.row[column.name], column.kind) ?? '-'}</TableCell>
      ))}
    </TableRow>
  )
}
