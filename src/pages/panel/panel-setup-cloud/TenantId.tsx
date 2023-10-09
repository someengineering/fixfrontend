import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'

export const TenantId = () => {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const { selectedWorkspace } = useUserProfile()
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(selectedWorkspace?.id || '').then(() => {
        setShowSnackbar(true)
      })
    } catch {}
  }
  const handleCloseSnackbar = () => {
    setShowSnackbar(false)
  }
  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          <Trans>Copied to Clipboard!</Trans>
        </Alert>
      </Snackbar>
      <Box
        display="inline-flex"
        bgcolor="grey.300"
        alignItems="center"
        ml={{ xs: 0, md: 2 }}
        mb={{ xs: 1, md: 0 }}
        width={{ xs: 300, md: 430 }}
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
      <Box ml={2} alignSelf={{ xs: 'end', md: 'center' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
