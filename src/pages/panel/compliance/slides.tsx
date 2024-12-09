import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'

export const slides = [
  {
    header: <Trans>Learn more about Compliance</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The Compliance tab evaluates your infrastructure against various compliance frameworks and standards by running a series of
            controls.
          </Typography>
          <Typography variant="subtitle1">
            Cloud security standards are structured guidelines and regulations designed to safeguard cloud computing environments. These
            standards are developed by international standards organizations, governmental agencies, and industry leaders.
          </Typography>
          <Typography variant="subtitle1">
            The frameworks include built-in controls and cloud configuration rules mapped to the control lists and recommendations of each
            framework. Fix calculates an overall compliance score for each framework and highlights the individual controls that passed or
            failed.
          </Typography>
          <Typography variant="subtitle1">
            You can explore a specific framework in detail to better understand your compliance score and identify weak areas. This allows
            you to view the different categories within the framework and the status of each rule. You can refine your analysis by selecting
            a specific cloud account to verify its security posture.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
]
