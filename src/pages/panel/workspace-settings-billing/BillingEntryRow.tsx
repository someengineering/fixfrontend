import { useLingui } from '@lingui/react'
import { Button, TableCell, TableRow } from '@mui/material'
import { WorkspaceBillingEntry } from 'src/shared/types/server'
import { productTierToLabel } from './utils'

interface BillingEntryRowProps {
  billingEntry: WorkspaceBillingEntry
}

export const BillingEntryRow = ({ billingEntry }: BillingEntryRowProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  return (
    <TableRow>
      <TableCell>{billingEntry.period_start ? new Date(billingEntry.period_start).toLocaleTimeString(locale) : '-'}</TableCell>
      <TableCell>{billingEntry.tier ? productTierToLabel(billingEntry.tier) : '-'}</TableCell>
      <TableCell>
        <Button variant="outlined">PDF</Button>
      </TableCell>
      <TableCell>{billingEntry.nr_of_accounts_charged ?? '-'}</TableCell>
    </TableRow>
  )
}
