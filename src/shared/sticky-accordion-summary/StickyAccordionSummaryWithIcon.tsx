import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AccordionSummaryProps } from '@mui/material'
import { StickyAccordionSummary } from './StickyAccordionSummary'

export const StickyAccordionSummaryWithIcon = (props: Exclude<AccordionSummaryProps, 'expandIcon'> & { offset?: number }) => (
  <StickyAccordionSummary {...props} expandIcon={<ExpandMoreIcon />} />
)
