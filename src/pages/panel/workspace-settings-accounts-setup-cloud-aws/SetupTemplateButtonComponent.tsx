import { Box, Button } from '@mui/material'
import { LinkIcon } from 'src/assets/icons'

interface SetupTemplateButtonComponentProps {
  url?: string
  onClick?: () => void
}

export const SetupTemplateButtonComponent = ({ url, onClick }: SetupTemplateButtonComponentProps) => {
  return (
    <Button
      variant="text"
      size="large"
      startIcon={<LinkIcon />}
      sx={{
        maxWidth: '100%',
        justifyContent: 'start',
        bgcolor: 'background.default',
        userSelect: 'initial',
      }}
      onClick={onClick}
    >
      <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{url}</Box>
    </Button>
  )
}
