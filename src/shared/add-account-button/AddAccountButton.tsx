import { Trans } from '@lingui/macro'
import { Button } from '@mui/material'
import { AddIcon } from 'src/assets/icons'
import { useThemeMode } from 'src/core/theme'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'

export const AddAccountButton = () => {
  const { mode } = useThemeMode()
  const navigate = useAbsoluteNavigate()

  const handleGoToSetupCloudPage = () => {
    navigate('/accounts/setup-cloud')
  }
  return (
    <Button startIcon={<AddIcon />} variant={mode === 'dark' ? 'outlined' : 'contained'} onClick={handleGoToSetupCloudPage}>
      <Trans>Add an account</Trans>
    </Button>
  )
}
