import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { ComplianceCard } from './ComplianceCard'

interface CompliancePassedChecksCardProps {
  totalChecks: number
  passedChecks: number
}

export const CompliancePassedChecksCard = ({ passedChecks, totalChecks }: CompliancePassedChecksCardProps) => {
  const percentage = Math.round((passedChecks / totalChecks) * 100)
  return (
    <ComplianceCard
      avatar={
        <Stack width={80} height={80} bgcolor="background.default" borderRadius="50%" alignItems="center" justifyContent="center">
          <Typography variant="h4">{passedChecks}</Typography>
        </Stack>
      }
      color="primary"
      description={
        <Trans>
          {passedChecks} passed out of {totalChecks} controls
        </Trans>
      }
      percentage={percentage}
      title={<Trans>Passed controls</Trans>}
    />
  )
}
