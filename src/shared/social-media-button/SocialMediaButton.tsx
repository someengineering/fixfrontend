import { Button, styled } from '@mui/material'

interface SocialMediaButtonProps {
  backgroundColor?: string
  isDark?: boolean
}

export const SocialMediaButton = styled(Button)<SocialMediaButtonProps>(({ backgroundColor = '#ffffff', isDark }) => ({
  border: 0,
  borderRadius: 3,
  color: isDark ? '#ffffff' : '#000000',
  backgroundColor,
  cursor: 'pointer',
  fontSize: '19px',
  m: 1,
  overflow: 'hidden',
  px: 2,
  userSelect: 'none',
  align: 'left',
  height: '50px',
  '&:hover': {
    backgroundColor,
  },
}))
