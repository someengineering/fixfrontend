import { AccordionSummaryProps } from '@mui/material'
import { KeyboardArrowDownIcon } from 'src/assets/icons'
import { StickyAccordionSummary } from './StickyAccordionSummary'

export const StickyAccordionSummaryWithIcon = (props: Exclude<AccordionSummaryProps, 'expandIcon'> & { offset?: number }) => (
  <StickyAccordionSummary {...props} sx={{ bgcolor: 'background.paper', ...props.sx }} expandIcon={<KeyboardArrowDownIcon />} />
)
