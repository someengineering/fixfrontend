import { Avatar } from '@mui/material'
import { AwsLogo, GcpLogo } from 'src/assets/icons'

const CloudIcon = ({ cloud }: { cloud: string }) => {
  switch (cloud) {
    case 'aws':
      return <AwsLogo width={40} height={40} />
    case 'gcp':
      return <GcpLogo width={40} height={40} />
    default:
      return <Avatar sx={{ bgcolor: 'primary.main' }}>{cloud}</Avatar>
  }
}

export const CloudAvatar = ({ cloud }: { cloud: string }) => <CloudIcon cloud={cloud} />
