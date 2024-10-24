import { Box, Stack } from '@mui/material'
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  gridClasses,
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
    <Box sx={{ width: '100%', minHeight }}>
      <DataGridPremium
        apiRef={apiRef}
        {...props}
        slots={{
          toolbar: headerToolbar
            ? () => (
                <GridToolbarContainer>
                  <GridToolbarColumnsButton slotProps={{ button: { color: 'inherit' } }} />
                  <GridToolbarDensitySelector slotProps={{ button: { color: 'inherit' } }} />
                  <Stack alignSelf="end" flex={1}>
                    {headerToolbar}
                  </Stack>
                </GridToolbarContainer>
              )
            : undefined,
          ...props.slots,
        }}
        sx={{
          [`.${gridClasses.main}`]: {
            overflow: 'initial',
            position: 'relative',
            '*': {
              borderColor: 'divider',
            },
            [`.${gridClasses.columnHeader}`]: {
              bgcolor: 'common.white',
              position: 'sticky',
              zIndex: 1,
              top: 0,
            },
          },
          ...props.sx,
        }}
        slotProps={{
          ...props.slotProps,
          footer: {
            ...props.slotProps?.footer,
            sx: {
              position: 'sticky',
              bottom: 0,
              [`&.${gridClasses.withBorderColor}`]: {
                borderColor: 'divider',
              },
              ...props.slotProps?.footer?.sx,
            },
          },
        }}
      />
    </Box>
  )
}
