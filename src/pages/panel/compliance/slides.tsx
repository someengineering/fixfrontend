import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'

export const slides = [
  {
    header: <Trans>Learn more about Compliance</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
          <Typography variant="subtitle1">
            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          </Typography>
          <Typography variant="subtitle1">
            It as popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
]
