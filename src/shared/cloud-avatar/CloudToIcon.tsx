import { ReactNode } from 'react'
import { AwsLogo, AzureLogo, AzureLogoWithText, FixLogo, GcpLogo, GCPLogoWithText, SvgIconProps } from 'src/assets/icons'
import { AccountCloud } from 'src/shared/types/server-shared'

export interface CloudToIconProps extends SvgIconProps {
  cloud: AccountCloud
  fallback?: ReactNode
  withText?: boolean
}

export const CloudToIcon = ({ cloud, fallback, withText, ...props }: CloudToIconProps) => {
  switch (cloud.toLowerCase()) {
    case 'azure': {
      const Icon = withText ? AzureLogoWithText : AzureLogo
      return <Icon {...props} />
    }
    case 'fix':
      return <FixLogo color="primary.main" {...props} />

    case 'aws':
      return <AwsLogo {...props} />

    case 'gcp': {
      const Icon = withText ? GCPLogoWithText : GcpLogo
      return <Icon {...props} />
    }
  }
  return fallback
}
