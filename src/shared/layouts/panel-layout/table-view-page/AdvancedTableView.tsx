import { Box, Paper, Stack } from '@mui/material'
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium'
import { ReactNode } from 'react'

interface AdvancedTableViewProps<RowType extends readonly []> extends DataGridPremiumProps<RowType> {
  headerToolbar?: ReactNode
  minHeight?: number
}

export function AdvancedTableView<RowType extends readonly []>({ headerToolbar, minHeight, ...props }: AdvancedTableViewProps<RowType>) {
  const apiRef = useGridApiRef()
  return (
    <Box component={Paper} sx={{ width: '100%', minHeight }}>
      <DataGridPremium
        apiRef={apiRef}
        autoHeight
        {...props}
        slots={{
          toolbar: headerToolbar
            ? () => (
                <GridToolbarContainer>
                  <GridToolbarColumnsButton color="inherit" />
                  <GridToolbarDensitySelector color="inherit" />
                  <Stack alignSelf="end" flex={1}>
                    {headerToolbar}
                  </Stack>
                </GridToolbarContainer>
              )
            : undefined,
          ...props.slots,
        }}
        sx={{
          '.MuiDataGrid-main': {
            overflow: 'initial',
            position: 'relative',
            '.MuiDataGrid-columnHeaders': {
              position: 'sticky',
              bgcolor: 'background.default',
              zIndex: 1,
              top: 0,
            },
          },
          ...props.sx,
        }}
        slotProps={{
          footer: {
            sx: {
              position: 'sticky',
              bottom: 0,
              bgcolor: 'background.default',
              ...props.slotProps?.footer?.sx,
            },
            ...props.slotProps?.footer,
          },
          ...props.slotProps,
        }}
      />
    </Box>
  )
}
