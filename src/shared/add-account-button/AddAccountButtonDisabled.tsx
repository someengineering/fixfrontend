import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import { useThemeMode } from 'src/core/theme'

export const AddAccountButtonDisabled = () => (
  <Button startIcon={<AddIcon />} variant={useThemeMode().mode === 'dark' ? 'outlined' : 'contained'} disabled>
    <Trans>Add an account</Trans>
  </Button>
)
