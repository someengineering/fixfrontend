import { SVGProps } from 'react'
import { SeverityType } from 'src/shared/types/server-shared'
import CriticalSeverityIcon from './critical-severity.svg?react'
import HighSeverityIcon from './high-severity.svg?react'
import LowSeverityIcon from './low-severity.svg?react'
import MediumSeverityIcon from './medium-severity.svg?react'

interface SeverityItemProps extends SVGProps<SVGSVGElement> {
  severity: SeverityType
}

export const SeverityItem = ({ severity, ...rest }: SeverityItemProps) => {
  switch (severity) {
    case 'low':
      return <LowSeverityIcon width={32} height={8} {...rest} />
    case 'medium':
      return <MediumSeverityIcon width={32} height={8} {...rest} />
    case 'high':
      return <HighSeverityIcon width={32} height={8} {...rest} />
    case 'critical':
      return <CriticalSeverityIcon width={32} height={8} {...rest} />
  }
}
