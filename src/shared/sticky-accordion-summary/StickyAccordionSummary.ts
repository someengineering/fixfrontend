import { AccordionSummary, styled } from '@mui/material'

export const StickyAccordionSummary = styled(AccordionSummary)<{ offset?: number }>(({ theme, offset = 0 }) => ({
  position: 'sticky',
  top: theme.spacing(offset),
  background: 'inherit',
  boxShadow: theme.shadows[2],
  zIndex: 1,
}))
