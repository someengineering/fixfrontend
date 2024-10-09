import { styled } from '@mui/material'
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium'

export const StyledDataGrid = styled(DataGridPremium)(({ theme }) => ({
  border: 'none',
  ['--DataGrid-rowBorderColor']: theme.palette.divider,
  [`.${gridClasses.columnHeader}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.secondary,
    ...theme.typography.subtitle1,
  },
  [`.${gridClasses.footerContainer}`]: {
    borderTop: 'none',
  },
})) as typeof DataGridPremium
