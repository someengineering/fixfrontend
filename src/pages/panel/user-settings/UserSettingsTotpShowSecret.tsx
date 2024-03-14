import { Trans } from '@lingui/macro'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useCopyString } from 'src/shared/utils/useCopyString'

interface UserSettingsTotpShowSecretProps {
  secret?: string
}

export const UserSettingsTotpShowSecret = ({ secret }: UserSettingsTotpShowSecretProps) => {
  const [showSecret, setShowSecret] = useState(false)
  const copyString = useCopyString()
  const handleCopy = () => {
    if (secret) {
      void copyString(secret)
    }
  }
  const handleToggleShowSecret = () => {
    setShowSecret((prev) => !prev)
  }
  return (
    <Stack direction="row" spacing={1}>
      <Box
        display="inline-flex"
        bgcolor={({ palette }) => (palette.mode === 'light' ? 'grey.300' : 'grey.800')}
        alignItems="center"
        justifyContent="space-between"
        ml={{ xs: 0, md: 2 }}
        mb={{ xs: 1, md: 0 }}
        width={350}
        minHeight={40}
      >
        <Typography
          variant="h6"
          fontFamily="Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"
          p={{ xs: 1, md: 2 }}
          whiteSpace="nowrap"
          fontSize={{ xs: 12, md: 'initial' }}
        >
          {showSecret ? secret : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'}
        </Typography>
        <IconButton onClick={handleToggleShowSecret}>{showSecret ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
      </Box>
      <Box ml={2} alignSelf={{ xs: 'end', md: 'stretch' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy} sx={{ height: { xs: 'auto', md: '100%' } }}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </Stack>
  )
}
