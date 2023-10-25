import { Trans, t } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'

export const TenantId = () => {
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace } = useUserProfile()
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(selectedWorkspace?.id || '').then(() => {
        showSnackbar(t`Copied to Clipboard!`)
      })
    } catch {
      /* empty */
    }
  }
  return (
    <>
      <Box
        display="inline-flex"
        bgcolor={theme.palette.mode === 'light' ? 'grey.300' : 'grey.800'}
        alignItems="center"
        ml={{ xs: 0, md: 2 }}
        mb={{ xs: 1, md: 0 }}
        width={{ xs: 300, md: 430 }}
        minHeight={40}
      >
        <Typography
          variant="h6"
          fontFamily="Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"
          p={{ xs: 1, md: 2 }}
          whiteSpace="nowrap"
          fontSize={{ xs: 12, md: 'initial' }}
        >
          {selectedWorkspace?.id}
        </Typography>
      </Box>
      <Box ml={2} alignSelf={{ xs: 'end', md: 'stretch' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy} sx={{ height: { xs: 'auto', md: '100%' } }}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
