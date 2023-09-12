import { styled } from '@mui/material'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'

// TODO: this is default spinner maybe later we should change it

export const Spinner = styled('div', { shouldForwardProp })<{ width?: number }>(({ theme, width = 80 }) => ({
  display: 'inline-block',
  width: width,
  height: width,

  '&:after': {
    content: '" "',
    display: 'block',
    width: width * 0.8,
    height: width * 0.8,
    margin: theme.spacing(1),
    borderRadius: '50%',
    border: `${theme.spacing(0.75)} solid ${theme.palette.primary.main}`,
    borderColor: `${theme.palette.primary.main} transparent ${theme.palette.primary.main} transparent`,
    animation: 'lds-dual-ring 1.2s linear infinite',
  },

  '@keyframes lds-dual-ring': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}))
