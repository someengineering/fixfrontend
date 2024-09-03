import { IconButton, styled } from '@mui/material'
import { ExternalLinkButton } from 'src/shared/link-button'

export const PanelHeaderButton = styled(IconButton)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  margin: 0,
  borderRadius: '50%',
})

export const PanelHeaderLinkButton = styled(ExternalLinkButton)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  margin: 0,
  borderRadius: '50%',
})
