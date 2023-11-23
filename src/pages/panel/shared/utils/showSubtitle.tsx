import { Stack, Typography } from '@mui/material'
import { sortedSeverities } from 'src/shared/constants'
import { getMessage } from 'src/shared/defined-messages'
import { FailedChecksType } from 'src/shared/types/server'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { getColorBySeverity } from './getColorBySeverity'

export const showSubtitle = (data: Partial<FailedChecksType>) =>
  sortedSeverities
    .filter((key) => data[key])
    .map((key) => (
      <Stack key={key} direction="row">
        <Typography color={getColorBySeverity(key)} variant="body2">
          {getMessage(snakeCaseToUFStr(key))}
        </Typography>
        <Typography variant="body2">: {data[key]}</Typography>
      </Stack>
    ))
