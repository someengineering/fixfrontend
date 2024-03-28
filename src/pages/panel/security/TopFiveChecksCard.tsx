import { Grid } from '@mui/material'
import { FailedChecks } from 'src/pages/panel/shared/failed-checks'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FailedCheck } from 'src/shared/types/server'

interface TopFiveChecksCardProps {
  failedChecks?: FailedCheck[]
}

export const TopFiveChecksCard = ({ failedChecks }: TopFiveChecksCardProps) => {
  const navigate = useAbsoluteNavigate()
  return failedChecks ? (
    <Grid container spacing={2} my={{ xs: 2, md: 0 }}>
      {failedChecks.map((failedCheck, i) => (
        <FailedChecks
          failedCheck={failedCheck}
          key={i}
          navigate={navigate}
          withResources
          benchmarks={failedCheck.benchmarks.map((benchmark) => benchmark.title)}
        />
      ))}
    </Grid>
  ) : null
}
