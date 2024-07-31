import { ButtonBase, Grid, Typography } from '@mui/material'
import { NavigateFunction } from 'src/shared/absolute-navigate'
import { sortedSeverities } from 'src/shared/constants'
import { getMessage } from 'src/shared/defined-messages'
import { FailedChecksType } from 'src/shared/types/server'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { createInventorySearchTo } from './createInventorySearchTo'
import { getColorBySeverity } from './getColorBySeverity'

export const showSubtitle = (data: Partial<FailedChecksType>, change: 'node_compliant' | 'node_vulnerable', navigate: NavigateFunction) =>
  sortedSeverities
    .filter((key) => data[key])
    .map((key) => (
      <Grid
        item
        key={key}
        component={ButtonBase}
        onClick={() => navigate(createInventorySearchTo(`/diff.${change}[*].severity=${key}`, true))}
      >
        <Typography color={getColorBySeverity(key)} variant="body2">
          {getMessage(snakeCaseToUFStr(key))}
        </Typography>
        <Typography variant="body2">: {data[key]}</Typography>
      </Grid>
    ))
