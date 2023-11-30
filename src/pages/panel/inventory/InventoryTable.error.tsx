import { t } from '@lingui/macro'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useEffect, useRef } from 'react'
import { TablePagination, TableViewPage } from 'src/shared/layouts/panel-layout'

interface InventoryTableProps {
  searchCrit: string
  resetErrorBoundary: () => void
  setHasError: (hasError: boolean) => void
}

const defaultColumns = [
  {
    name: 'kind',
    kind: 'string',
    display: 'Kind',
  },
  {
    name: 'id',
    kind: 'string',
    display: 'Id',
  },
  {
    name: 'name',
    kind: 'string',
    display: 'Name',
  },
  {
    name: 'age',
    kind: 'duration',
    display: 'Age',
  },
  {
    name: 'last_update',
    kind: 'duration',
    display: 'Last Update',
  },
  {
    name: 'cloud',
    kind: 'string',
    display: 'Cloud',
  },
  {
    name: 'account',
    kind: 'string',
    display: 'Account',
  },
  {
    name: 'region',
    kind: 'string',
    display: 'Region',
  },
  {
    name: 'zone',
    kind: 'string',
    display: 'Zone',
  },
]

export const InventoryTableError = ({ searchCrit, resetErrorBoundary, setHasError }: InventoryTableProps) => {
  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) {
      setHasError(false)
      resetErrorBoundary()
    } else {
      setHasError(true)
      initialized.current = true
    }
  }, [searchCrit, resetErrorBoundary, setHasError])

  return (
    <TableViewPage pagination={<TablePagination dataCount={0} page={0} rowsPerPage={10} setPage={() => {}} setRowsPerPage={() => {}} />}>
      <Table stickyHeader aria-label={t`Accounts`}>
        <TableHead>
          <TableRow>
            {defaultColumns.map((column, i) => (
              <TableCell key={`${column.name}-${i}`}>{column.display}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    </TableViewPage>
  )
}
