import ClearIcon from '@mui/icons-material/Clear'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react'
import { Term } from 'src/shared/fix-query-parser'

interface InventoryFormFieldProps extends PropsWithChildren {
  value: string | Term | undefined
  label: ReactNode
  onClick: MouseEventHandler<HTMLDivElement>
  onClear: MouseEventHandler<HTMLButtonElement>
}

export const InventoryFormField = ({ value, onClick, label, onClear }: InventoryFormFieldProps) => {
  const valueStr = typeof value === 'string' ? value : value?.toString()
  return (
    <Box pt={1} pr={1} height="100%">
      <Button
        onClick={onClick}
        component={Stack}
        variant="outlined"
        boxShadow={4}
        direction="row"
        bgcolor="primary.main"
        pr={valueStr ? '4px !important' : undefined}
        spacing={0.5}
        alignItems="center"
        sx={{ textTransform: 'none', minHeight: 42 }}
        endIcon={
          valueStr ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                onClear(e)
              }}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : null
        }
      >
        <Stack>
          <Typography variant="body2" fontWeight={700} p={0} width="100%" textAlign="left" whiteSpace="nowrap">
            {label}
          </Typography>
          {valueStr ? (
            <Typography color="common.black" variant="subtitle1" p={0} width="100%" textAlign="center">
              {valueStr}
            </Typography>
          ) : null}
        </Stack>
      </Button>
    </Box>
  )
}
