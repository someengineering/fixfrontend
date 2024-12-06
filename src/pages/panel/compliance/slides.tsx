import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'

export const slides = [
  {
    header: <Trans>Learn more about Compliance</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The compliance tab runs checks against your infrastructure for different compliance frameworks and standards.
          </Typography>
          <Typography variant="subtitle1">
            Cloud security standards are structured guidelines and regulations crafted to secure cloud computing environments, developed by
            international standards bodies, governmental agencies, and industry leaders.
          </Typography>
          <Typography variant="subtitle1">
            The frameworks consist of built-in controls and cloud configuration rules that are mapped to the control lists and
            recommendations of each framework. Fix calculates your overall compliance score for each one of the frameworks and shows you the
            individual checks that passed or failed.
          </Typography>
          <Typography variant="subtitle1">
            To gain a deeper understanding of your compliance score and understand where your weak areas are, you can drill down into a
            specific framework and see the different categories that constitute the framework and the status of each one of the rules. You
            can further narrow down by picking a specific cloud account and verify the security posture for that account.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
]
