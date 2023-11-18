import { Button, Typography } from '@mui/material'

export const SetupTemplateButtonComponent = ({ url, onClick }: { url?: string; onClick?: () => void }) => {
  return (
    <Button variant="text" sx={{ maxWidth: '100%' }} onClick={onClick}>
      <Typography
        variant="subtitle2"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        sx={{ textTransform: 'none', userSelect: 'all' }}
      >
        {url}
      </Typography>
    </Button>
  )
}
