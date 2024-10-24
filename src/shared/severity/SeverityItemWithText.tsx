import { Stack, StackProps, Typography } from '@mui/material'
import { SeverityType } from 'src/shared/types/server-shared'
import { wordToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { SeverityItem } from './SeverityItem'

export interface SeverityItemWithTextProps extends StackProps {
  severity: SeverityType
}

export const SeverityItemWithText = ({ severity, ...rest }: SeverityItemWithTextProps) => (
  <Stack direction="row" spacing={1} alignItems="center" {...rest}>
    <SeverityItem severity={severity} />
    <Typography variant="subtitle1" color="textPrimary">
      {wordToUFStr(severity)}
    </Typography>
  </Stack>
)
