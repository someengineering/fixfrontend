import { Stack, styled } from '@mui/material'

export const DashboardPaper = styled(Stack)(({ theme, borderRadius, padding }) => ({
  width: '100%',
  borderRadius: borderRadius ? undefined : '12px',
  border: `1px solid ${theme.palette.divider}`,
  padding: padding ? undefined : theme.spacing(2.5),
}))
