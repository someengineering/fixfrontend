import { Button, TableCell, TableRow } from '@mui/material'
import { WorkspaceBillingEntry } from 'src/shared/types/server'

interface BillingEntryRowProps {
  billingEntry: WorkspaceBillingEntry
}

export const BillingEntryRow = ({ billingEntry }: BillingEntryRowProps) => {
  new Intl.NumberFormat(undefined, {
    currency: '$',
  })
  return (
    <TableRow>
      <TableCell>{billingEntry.period_start ? new Date(billingEntry.period_start).toLocaleTimeString() : '-'}</TableCell>
      <TableCell>{billingEntry.tier ? billingEntry.tier.replace(/([A-Z0-9])/g, ' $1').trim() : '-'}</TableCell>
      <TableCell>
        <Button variant="outlined">PDF</Button>
      </TableCell>
      <TableCell>{billingEntry.nr_of_accounts_charged ?? '-'}</TableCell>
    </TableRow>
  )
}
