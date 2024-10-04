import { Stack, Typography } from '@mui/material'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { SvgIconProps } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'

interface DashboardCardProps extends PropsWithChildren {
  title: ReactNode
  subtitle?: ReactNode
  SubtitleIcon?: FC<SvgIconProps>
}

export const DashboardCard = ({ subtitle, SubtitleIcon, title, children }: DashboardCardProps) => {
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">{title}</Typography>
        {subtitle ? (
          <Stack direction="row" spacing={0.5} alignItems="center">
            {SubtitleIcon && <SubtitleIcon color={panelUI.uiThemePalette.text.sub} width={16} height={16} />}
            <Typography variant="subtitle1" color={panelUI.uiThemePalette.text.sub}>
              {subtitle}
            </Typography>
          </Stack>
        ) : null}
      </Stack>
      {children}
    </Stack>
  )
}
