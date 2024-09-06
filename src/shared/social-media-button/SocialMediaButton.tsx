import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/material'
import { shouldForwardPropWithWhiteList } from 'src/shared/utils/shouldForwardProp'

interface SocialMediaButtonProps {
  backgroundColor?: string
  isDark?: boolean
}

export const SocialMediaButton = styled(LoadingButton, {
  shouldForwardProp: shouldForwardPropWithWhiteList(['startIcon', 'variant', 'loadingPosition']),
})<SocialMediaButtonProps>(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  width: '100%',
}))
