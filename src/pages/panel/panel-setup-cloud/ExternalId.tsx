import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Alert, Box, Button, IconButton, Skeleton, Snackbar, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getExternalIdQuery } from 'src/pages/panel/shared-queries'

export const ExternalIdSkeleton = () => {
  return (
    <Box ml={2}>
      <Skeleton variant="rectangular" width={376} height={52} />
    </Box>
  )
}

export const ExternalId = () => {
  const [showExternalId, setShowExternalId] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const { selectedOrganization } = useUserProfile()
  const { data: ExternalIdData } = useQuery(['organization-external-id', selectedOrganization?.id], getExternalIdQuery, {
    enabled: !!selectedOrganization?.id,
  })
  const handleCopy = () => {
    try {
      window.navigator.clipboard.writeText(ExternalIdData || '').then(() => {
        setShowSnackbar(true)
      })
    } catch {}
  }
  const handleToggleShowExternalId = () => {
    setShowExternalId((prev) => !prev)
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
        width={{ xs: 294, md: 400 }}
      >
        <Typography
          variant="h6"
          fontFamily="Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"
          p={{ xs: 1, md: 2 }}
          fontSize={{ xs: 12, md: 'initial' }}
        >
          {showExternalId ? ExternalIdData : '********-****-****-****-************'}
        </Typography>
        <Box>
          <IconButton onClick={handleToggleShowExternalId}>{showExternalId ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
        </Box>
      </Box>
      <Box ml={2} alignSelf={{ xs: 'end', md: 'center' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
