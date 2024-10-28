import { AWSFrameworkIcon, CISFrameworkIcon, ISO27001FrameworkIcon, NISFrameworkIcon, SvgIconProps } from 'src/assets/icons'

interface FrameworkIconProps extends SvgIconProps {
  frameworkId: string
}

export const FrameworkIcon = ({ frameworkId, ...rest }: FrameworkIconProps) => {
  if (frameworkId.includes('cis')) {
    return <CISFrameworkIcon color="transparent" {...rest} />
  }
  if (frameworkId.includes('aws')) {
    return <AWSFrameworkIcon color="transparent" {...rest} />
  }
  if (frameworkId.includes('nis')) {
    return <NISFrameworkIcon color="transparent" {...rest} />
  }
  if (frameworkId.includes('iso27001')) {
    return <ISO27001FrameworkIcon color="transparent" {...rest} />
  }
}
