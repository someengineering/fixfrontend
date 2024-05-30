import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceExternalIdQuery } from 'src/pages/panel/shared/queries'
import { useCopyString } from 'src/shared/utils/useCopyString'

export const ExternalId = () => {
  const theme = useTheme()
  const [showExternalId, setShowExternalId] = useState(false)
  const { selectedWorkspace } = useUserProfile()
  const { data: ExternalIdData } = useSuspenseQuery({
    queryKey: ['workspace-external-id', selectedWorkspace?.id],
    queryFn: getWorkspaceExternalIdQuery,
  })
  const copyString = useCopyString()
  const handleCopy = () => {
    if (ExternalIdData) {
      void copyString(ExternalIdData)
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
