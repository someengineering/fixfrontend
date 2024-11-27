import { Trans } from '@lingui/macro'
import { CircularProgress, Stack, Typography } from '@mui/material'
import { ComplianceCard } from './ComplianceCard'

interface CompliancePostureCardProps {
  totalChecks: number
  passedChecks: number
}

export const CompliancePostureCard = ({ passedChecks, totalChecks }: CompliancePostureCardProps) => {
  const percentage = Math.round((passedChecks / totalChecks) * 100)
  return (
    <ComplianceCard
      avatar={
        <Stack
          width={80}
          height={80}
          position="relative"
          color={({ palette }) => palette.divider}
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress
            value={-percentage}
            color="warning"
            variant="determinate"
            size={80}
            sx={{ circle: { strokeWidth: 2 }, position: 'absolute' }}
          />
          <CircularProgress
            value={100 - percentage}
            color="inherit"
            variant="determinate"
            size={80}
            sx={{ circle: { strokeWidth: 2 }, position: 'absolute' }}
          />
          <Typography color="textPrimary" variant="h4">
            {percentage}%
          </Typography>
        </Stack>
      }
      color="warning"
      description={<Trans>{percentage}% average compliance posture</Trans>}
      percentage={percentage}
      title={<Trans>Compliance Posture</Trans>}
    />
  )
}
