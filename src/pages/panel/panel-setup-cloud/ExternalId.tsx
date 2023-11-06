import { Trans, t } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, Skeleton, Typography, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { getExternalIdQuery } from 'src/pages/panel/shared-queries'

export const ExternalIdSkeleton = () => {
  return (
    <Box ml={2}>
      <Skeleton variant="rectangular" width={376} height={52} />
    </Box>
  )
}

export const ExternalId = () => {
  const theme = useTheme()
  const [showExternalId, setShowExternalId] = useState(false)
  const { selectedWorkspace } = useUserProfile()
  const { showSnackbar } = useSnackbar()
  const { data: ExternalIdData } = useQuery({
    queryKey: ['workspace-external-id', selectedWorkspace?.id],
    queryFn: getExternalIdQuery,
    enabled: !!selectedWorkspace?.id,
  })
  const handleCopy = () => {
    try {
      window.navigator.clipboard
        .writeText(ExternalIdData || '')
        .then(() => {
          void showSnackbar(t`Copied to Clipboard!`)
        })
        .catch(() => {})
    } catch {
      /* empty */
    }
  }
  const handleToggleShowExternalId = () => {
    setShowExternalId((prev) => !prev)
  }
  return (
    <>
      <Box
        display="inline-flex"
        bgcolor={theme.palette.mode === 'light' ? 'grey.300' : 'grey.800'}
        alignItems="center"
        justifyContent="space-between"
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
          {showExternalId ? ExternalIdData : '********-****-****-****-************'}
        </Typography>
        <Box>
          <IconButton onClick={handleToggleShowExternalId}>{showExternalId ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
        </Box>
      </Box>
      <Box ml={2} alignSelf={{ xs: 'end', md: 'stretch' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy} sx={{ height: { xs: 'auto', md: '100%' } }}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
