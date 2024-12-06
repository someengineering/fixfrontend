import { Trans } from '@lingui/macro'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { ComplianceDetailTreeItemTableRow, ComplianceDetailTreeItemTableRowProps } from './ComplianceDetailTreeItemTableRow'

interface ComplianceDetailTreeItemTableProps {
  item: ComplianceDetailTreeItemTableRowProps['check'][]
  accountName?: string
  description?: string
}

export const ComplianceDetailTreeItemTable = ({ item, accountName, description }: ComplianceDetailTreeItemTableProps) => {
  return (
    <Stack borderRadius="12px" border={({ palette }) => `1px solid ${palette.divider}`} width="100%" overflow="hidden" px={3} py={1} my={1}>
      {description ? (
        <>
          <Typography variant="subtitle1" py={2}>
            {description}
          </Typography>
          <Divider />
        </>
      ) : null}
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle1" p={2} flexGrow={1} color="textSecondary">
          <Trans>Control</Trans>
        </Typography>
        <Typography variant="subtitle1" p={2} flexShrink={0} width={160} color="textSecondary">
          <Trans>Severity</Trans>
        </Typography>
        <Typography variant="subtitle1" p={2} flexShrink={0} width={120} color="textSecondary">
          <Trans>Resources</Trans>
        </Typography>
        <Box p={2} flexShrink={0} width={87} />
        <Box p={2} flexShrink={0} width={94} />
      </Stack>
      {item.map((check) => (
        <ComplianceDetailTreeItemTableRow key={check.nodeId} check={check} accountName={accountName} />
      ))}
    </Stack>
  )
}
