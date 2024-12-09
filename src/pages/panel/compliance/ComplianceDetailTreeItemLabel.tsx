import { Trans } from '@lingui/macro'
import { LinearProgress, Stack, Typography } from '@mui/material'
import { ComplianceDetailTreeItemProps } from './ComplianceDetailTreeItem'

export const ComplianceDetailTreeItemLabel = ({ item, firstItem, frameworkIcon }: ComplianceDetailTreeItemProps) => {
  const passingChecks = item.totalChecks - item.numberOfChecksFailing
  const checkFailingPercentage = Math.round((passingChecks * 100) / item.totalChecks)
  return (
    <Stack direction="row" spacing={1} alignItems="center" id={`item-${item.nodeId}`} position="relative">
      <Stack direction="row" spacing={1} flex={1} flexShrink={0} alignItems="center">
        {frameworkIcon}
        <Typography variant="subtitle1" fontWeight={500}>
          {item.reported.name}
        </Typography>
      </Stack>
      <Stack flex={0} flexShrink={0} minWidth={360} spacing={1.5} color="text.disabled" direction="row" alignItems="center">
        <LinearProgress
          variant="determinate"
          color={firstItem ? 'primary' : 'inherit'}
          value={item.totalChecks ? checkFailingPercentage : 0}
          sx={{ width: 250, height: 6, borderRadius: 3 }}
        />
        <Typography color="textPrimary" variant="subtitle1">
          {item.totalChecks ? `${checkFailingPercentage}%` : 'N/A'}
        </Typography>
      </Stack>
      <Stack flex={0} flexShrink={0} minWidth={224}>
        <Typography color="textPrimary" variant="subtitle1">
          {item.totalChecks ? (
            <Trans>
              {passingChecks} of {item.totalChecks}
            </Trans>
          ) : null}
        </Typography>
      </Stack>
    </Stack>
  )
}
