import { colors } from '@mui/material'
import { OAuthProviderNames } from 'src/shared/types/server-shared'

export const getColorFromOAuthType = (name: OAuthProviderNames) => {
  switch (name) {
    case 'github':
      return { isDark: true, backgroundColor: colors.grey[800] }
    case 'google':
      return { isDark: false, backgroundColor: '#fff' }
  }
}
