import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import { Box, Button, Typography } from '@mui/material'
import { useUserProfile } from 'src/core/auth'

export const TenantId = () => {
  const { selectedOrganization } = useUserProfile()
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(selectedOrganization?.id || '')
    } catch {}
  }
  return (
    <>
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
          {selectedOrganization?.id}
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
