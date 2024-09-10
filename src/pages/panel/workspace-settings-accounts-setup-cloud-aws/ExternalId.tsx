import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceExternalIdQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import { useCopyString } from 'src/shared/utils/useCopyString'

export const ExternalId = () => {
  const [showExternalId, setShowExternalId] = useState(false)
  const { selectedWorkspace } = useUserProfile()
  const { data: ExternalIdData } = useSuspenseQuery({
    queryKey: ['workspace-external-id', selectedWorkspace?.id],
    queryFn: getWorkspaceExternalIdQuery,
  })
  const copyString = useCopyString()
  const handleCopy = () => {
    if (ExternalIdData) {
      copyString(ExternalIdData)
    }
  }
  const handleToggleShowExternalId = () => {
    setShowExternalId((prev) => !prev)
  }
  return (
    <>
      <Stack
        border={`1px solid ${panelUI.uiThemePalette.input.border}`}
        direction="row"
        alignItems="center"
        borderRadius="12px"
        p={2}
        pr={0.25}
        flex={1}
        height={44}
        justifyContent="space-between"
      >
        <Typography variant="body2" whiteSpace="nowrap">
          {showExternalId ? ExternalIdData : '********-****-****-****-************'}
        </Typography>
        <Box>
          <IconButton onClick={handleToggleShowExternalId}>{showExternalId ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
        </Box>
      </Stack>
      <Box width={{ xs: '100%', sm: 'auto' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy} sx={{ height: 44 }} fullWidth>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
