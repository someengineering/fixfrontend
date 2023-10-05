import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'

export const TenantId = () => {
  const [showTenant, setShowTenant] = useState(false)
  const { selectedOrganization } = useUserProfile()
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(selectedOrganization?.id || '')
    } catch {}
  }
  const handleToggleShowTenant = () => {
    setShowTenant((prev) => !prev)
  }
  return (
    <>
      <Box display="inline-flex" ml={2} bgcolor="grey.300" alignItems="center">
        <Typography
          variant="h6"
          fontFamily="Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"
          p={2}
        >
          {showTenant ? selectedOrganization?.id : '********-****-****-****-************'}
        </Typography>
        <Box>
          <IconButton onClick={handleToggleShowTenant}>{showTenant ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
        </Box>
      </Box>
      <Box ml={2}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
