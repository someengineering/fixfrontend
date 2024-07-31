import { Trans } from '@lingui/macro'
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

interface InventoryInfoResourceChangesTableProps {
  changes: [number, number, number]
}

export const InventoryInfoResourceChangesTable = ({ changes }: InventoryInfoResourceChangesTableProps) => (
  <TableContainer>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Trans>New resources created</Trans>
          </TableCell>
          <TableCell>
            <Trans>{changes[0]}</Trans>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Existing resources updated</Trans>
          </TableCell>
          <TableCell>
            <Trans>{changes[1]}</Trans>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Existing resources deleted</Trans>
          </TableCell>
          <TableCell>
            <Trans>{changes[2]}</Trans>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)
