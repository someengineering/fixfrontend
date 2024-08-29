import { buttonClasses, ButtonProps } from '@mui/material'
import { panelUI } from 'src/shared/constants'
import { OAuthProviderNames } from 'src/shared/types/server-shared'

export const getColorFromOAuthType = (name: OAuthProviderNames): ButtonProps => {
  switch (name) {
    case 'github':
      return { color: 'inherit', sx: { [`.${buttonClasses.icon} svg`]: { fill: panelUI.uiThemePalette.accent.darkGray } } }
    case 'google':
      return {} as const
  }
}
