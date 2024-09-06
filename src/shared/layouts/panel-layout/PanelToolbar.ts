import { styled, Toolbar } from '@mui/material'
import { panelUI } from 'src/shared/constants'

export const PanelToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(3.75),
    paddingRight: theme.spacing(3.75),
    minHeight: panelUI.headerHeight,
    height: panelUI.headerHeight,
  },
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    minHeight: panelUI.headerHeight,
    height: panelUI.headerHeight,
  },
}))
