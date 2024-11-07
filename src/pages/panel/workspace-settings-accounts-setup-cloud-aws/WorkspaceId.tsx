import { Trans, t } from '@lingui/macro'
import { Box, Button, Stack, Typography } from '@mui/material'
import { CopyAllIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { panelUI } from 'src/shared/constants'

export const WorkspaceId = () => {
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace } = useUserProfile()
  const handleCopy = () => {
    try {
      window.navigator.clipboard
        .writeText(selectedWorkspace?.id || '')
        .then(() => {
          showSnackbar(t`Copied to Clipboard!`, { alertColor: 'success' })
        })
        .catch(() => {})
    } catch {
      /* empty */
    }
  }
  return (
    <>
      <Stack
        display="inline-flex"
        border={`1px solid ${panelUI.uiThemePalette.input.border}`}
        borderRadius="12px"
        p={2}
        flex={1}
        height={44}
        justifyContent="center"
      >
        <Typography variant="body2" whiteSpace="nowrap">
          {selectedWorkspace?.id}
        </Typography>
      </Stack>
      <Box width={{ xs: '100%', sm: 'auto' }}>
        <Button variant="contained" startIcon={<CopyAllIcon />} onClick={handleCopy} sx={{ height: 44 }} fullWidth>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
