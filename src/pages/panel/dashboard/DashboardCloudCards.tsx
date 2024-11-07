import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { CloudToIcon } from 'src/shared/cloud-avatar'
import { panelUI } from 'src/shared/constants'
import { AccountCloud } from 'src/shared/types/server-shared'
import { DashboardPaper } from './DashboardPaper'

interface DashboardCloudCardProps {
  cloud: AccountCloud
  accounts: number
  regions: number
  resourceTypes: number
  resources: number
}

interface DashboardCloudCardItemProps {
  title: ReactNode
  value: number
}

const DashboardCloudCardItem = ({ title, value }: DashboardCloudCardItemProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  return (
    <DashboardPaper alignItems="center" justifyContent="center" p={2} borderRadius="6px">
      <Typography variant="h4">{value.toLocaleString(locale)}</Typography>
      <Typography variant="subtitle2" color={panelUI.uiThemePalette.text.sub}>
        {title}
      </Typography>
    </DashboardPaper>
  )
}

export const DashboardCloudCards = ({ accounts, cloud, regions, resourceTypes, resources }: DashboardCloudCardProps) => {
  return (
    <DashboardPaper spacing={2}>
      <CloudToIcon cloud={cloud} withText height="32px" width="" />
      <Stack direction="row" spacing={2}>
        <DashboardCloudCardItem title={<Trans>Cloud accounts</Trans>} value={accounts} />
        <DashboardCloudCardItem title={<Trans>Regions</Trans>} value={regions} />
      </Stack>
      <Stack direction="row" spacing={2}>
        <DashboardCloudCardItem title={<Trans>Resource types</Trans>} value={resourceTypes} />
        <DashboardCloudCardItem title={<Trans>Resources</Trans>} value={resources} />
      </Stack>
    </DashboardPaper>
  )
}
