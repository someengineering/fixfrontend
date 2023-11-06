import { Button, Typography } from '@mui/material'

export const SetupTemplateButtonComponent = ({ url, isSkleton }: { url?: string; isSkleton?: boolean }) => {
  return (
    <Button href={(!isSkleton && url) || '#'} target={isSkleton ? undefined : '_blank'} variant="text" sx={{ maxWidth: '100%', px: 0 }}>
      <Typography variant="subtitle2" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
        {url}
      </Typography>
    </Button>
  )
}
