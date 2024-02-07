import { Trans } from '@lingui/macro'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Link, Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { env } from 'src/shared/constants'
import { useHasBenchmarkCheck } from './check-hooks'

export const BenchmarkCheckGuard = () => {
  const hasBenchmark = useHasBenchmarkCheck()

  return !hasBenchmark ? (
    <Outlet />
  ) : (
    <Stack
      display="flex"
      flexGrow={1}
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      maxWidth="800px"
      margin="0 auto"
    >
      <Trans>
        <Typography variant="h3" textAlign="center">
          Your cloud account has been successfully added!
        </Typography>
        <Typography variant="h5" textAlign="left" width="100%" mt={2}>
          Thank you for deploying the CloudFormation stack in your AWS account.
        </Typography>
        <Typography variant="h6" textAlign="left" width="100%" mt={4}>
          Here’s what’s happening behind the scenes:
        </Typography>
        <Stack spacing={1} component="ul" mt={0.5}>
          <Typography component="li" textAlign="left" width="100%">
            Initial Trust Establishment (5-15 minutes): After deployment, a cross-account trust for the role included in the stack is
            established between your and Fix's AWS accounts. Due to AWS's distributed infrastructure, this step can take anywhere from 5 to
            15 minutes as we wait for the trust to become active across their network. During this time, our backend continuously probes to
            confirm when the trust is operational.
          </Typography>
          <Typography component="li" textAlign="left" width="100%">
            First Security Scan (2-10 minutes): Once the trust is established, we proceed with the initial security scan of your
            environment. Depending on the size and complexity of your cloud account, this scan can take anywhere from 2 to 10 minutes.
          </Typography>
          <Typography component="li" textAlign="left" width="100%">
            Email Notification: You won't have to wait in front of your browser to know when we're done. After the first security scan is
            completed, we'll notify you by email.
          </Typography>
        </Stack>
        <Typography variant="h6" textAlign="left" width="100%" mt={2}>
          What to Expect Next:
        </Typography>
        <Stack spacing={1} component="ul" mt={0.5}>
          <Typography component="li" textAlign="left" width="100%">
            Dashboard Availability: Your dashboard and inventory will be available shortly after the completion of the initial security
            scan. This gives you a comprehensive view of your security posture and any findings we have identified.
          </Typography>
          <Typography component="li" textAlign="left" width="100%">
            Subsequent Scans: After the initial scan, subsequent security scans will also take 2 to 10 minutes each, without the initial
            delay, since the trust has to be established only once.
          </Typography>
        </Stack>
        <Typography variant="h6" textAlign="left" width="100%" mt={2}>
          We appreciate your patience during this setup process. If you have any questions or need assistance, please do not hesitate to
          contact us directly{' '}
          <Link target="_blank" href={env.discordUrl} rel="noopener noreferrer">
            on our Discord server
            <OpenInNewIcon sx={{ height: 16, mb: '-3px' }} />
          </Link>
          .
        </Typography>
      </Trans>
    </Stack>
  )
}
