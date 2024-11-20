import { styled } from '@mui/material'
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium'

export const StyledDataGrid = styled(DataGridPremium)(({ theme }) => ({
  border: 'none',
  '--DataGrid-containerBackground': theme.palette.common.white,
  height: '100%',
  width: '100%',
  flex: 1,
  ['--DataGrid-rowBorderColor']: theme.palette.divider,
  [`.${gridClasses.root}`]: {
    height: '100%',
    minHeight: 0,
  },
  [`.${gridClasses.columnHeader}`]: {
    color: theme.palette.text.secondary,
    ...theme.typography.subtitle1,
  },
  [`.${gridClasses.footerContainer}`]: {
    borderTop: 'none',
  },
})) as typeof DataGridPremium
