import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/material'
import { shouldForwardPropWithWhiteList } from 'src/shared/utils/shouldForwardProp'

interface SocialMediaButtonProps {
  backgroundColor?: string
  isDark?: boolean
}

export const SocialMediaButton = styled(LoadingButton, {
  shouldForwardProp: shouldForwardPropWithWhiteList(['startIcon', 'variant', 'loadingPosition']),
})<SocialMediaButtonProps>(({ backgroundColor = '#ffffff', isDark }) => ({
  border: 0,
  borderRadius: 3,
  color: isDark ? '#ffffff' : '#000000',
  backgroundColor,
  cursor: 'pointer',
  m: 1,
  overflow: 'hidden',
  px: 2,
  userSelect: 'none',
  align: 'left',
  minHeight: '50px',
  width: '100%',
  '&:hover': {
    backgroundColor,
  },
}))
