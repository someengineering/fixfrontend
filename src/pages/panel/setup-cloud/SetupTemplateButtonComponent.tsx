import { Button, Typography } from '@mui/material'

interface SetupTemplateButtonComponentProps {
  url?: string
  onClick?: () => void
}

export const SetupTemplateButtonComponent = ({ url, onClick }: SetupTemplateButtonComponentProps) => {
  return (
    <Button variant="text" sx={{ maxWidth: '100%' }} onClick={onClick}>
      <Typography variant="subtitle2" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" sx={{ userSelect: 'all' }}>
        {url}
      </Typography>
    </Button>
  )
}
