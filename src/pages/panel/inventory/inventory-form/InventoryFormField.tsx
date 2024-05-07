import ClearIcon from '@mui/icons-material/Clear'
import { Box, Button, Chip, IconButton, Stack, Typography, alpha } from '@mui/material'
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react'
import { Term, termValueToString } from 'src/shared/fix-query-parser'

interface InventoryFormFieldProps extends PropsWithChildren {
  value?: string | Term
  forceShowClearButton?: boolean
  label: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  onClear: MouseEventHandler<HTMLDivElement>
  endIcon?: ReactNode
}

export const InventoryFormField = ({
  value,
  onClick,
  label,
  onClear,
  endIcon,
  children,
  forceShowClearButton,
}: InventoryFormFieldProps) => {
  const valueStr = typeof value === 'string' ? value : value ? termValueToString(value, true) : undefined
  const hasValue = !!(valueStr && valueStr.length)

  return (
    <Box pt={1} pr={1} height="100%">
      <Stack
        onClick={onClick}
        component={onClick ? Button : 'div'}
        variant={onClick ? 'outlined' : undefined}
        boxShadow={4}
        direction="row"
        pr={hasValue || forceShowClearButton ? '4px !important' : undefined}
        spacing={0.5}
        alignItems="center"
        sx={{
          minHeight: 42,
          ...(onClick
            ? {}
            : {
                pl: 2,
                pr: 0.5,
                py: 0.75,
                borderRadius: 1,
                color: 'primary.main',
                borderColor: ({ palette }) => alpha(palette.primary.main, 0.5),
                borderStyle: 'solid',
                borderWidth: 1,
              }),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
          <Typography variant="body2" fontWeight={700} p={0} width="auto" textAlign="left" whiteSpace="nowrap">
            {label}
            {hasValue ? ':' : ''}
          </Typography>
          {children ??
            (hasValue ? (
              typeof valueStr === 'string' ? (
                <Chip label={valueStr} color="primary" size="small" variant="outlined" />
              ) : !valueStr.length ? (
                <Typography color="common.black" variant="subtitle1" fontWeight={700} p={0} width="auto" textAlign="center">
                  []
                </Typography>
              ) : (
                <>
                  {valueStr.slice(0, 2).map((item, i) => (
                    <Chip key={i} label={item} color="primary" size="small" variant="outlined" />
                  ))}
                  {valueStr.length > 2 ? <Chip label={`+${valueStr.length - 2}`} color="primary" size="small" variant="filled" /> : null}
                </>
              )
            ) : null)}
          {hasValue || forceShowClearButton ? (
            <IconButton
              component="div"
              color="primary"
              onClick={(e) => {
                e.stopPropagation()
                onClear(e)
              }}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : (
            endIcon
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
