import { Trans } from '@lingui/macro'
import { Button } from '@mui/material'
import { AddIcon } from 'src/assets/icons'
import { useThemeMode } from 'src/core/theme'

export const AddAccountButtonDisabled = () => (
  <Button startIcon={<AddIcon />} variant={useThemeMode().mode === 'dark' ? 'outlined' : 'contained'} disabled>
    <Trans>Add an account</Trans>
  </Button>
)
