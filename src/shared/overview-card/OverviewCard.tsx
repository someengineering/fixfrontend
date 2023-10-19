import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardContent, Icon, Stack, SvgIcon, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface OverviewCardProps {
  title?: ReactNode
  value?: ReactNode
  icon?: ReactNode
  iconBackgroundColor?: string
  bottomContent?: ReactNode
  expandableContent?: ReactNode
}

export const OverviewCard = ({ title, value, icon, iconBackgroundColor, bottomContent, expandableContent }: OverviewCardProps) => {
  const bottom = bottomContent ? (
    <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
      {expandableContent ? (
        <Accordion elevation={0} disableGutters square sx={{ background: 'none', width: '100%', '&::before': { content: 'none' } }}>
          <AccordionSummary
            expandIcon={
              <Icon fontSize="small">
                <ExpandMoreIcon />
              </Icon>
            }
            sx={{ p: 0, minHeight: 0, '.MuiAccordionSummary-content': { m: 0 } }}
          >
            {bottomContent}
          </AccordionSummary>
          <AccordionDetails
            sx={{
              '&.MuiAccordionDetails-root': {
                p: 0,
              },
            }}
          >
            {expandableContent}
          </AccordionDetails>
        </Accordion>
      ) : (
        bottomContent
      )}
    </Stack>
  ) : null
  return (
    <Card>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            {title && (
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
            )}
            {value && <Typography variant="h5">{value}</Typography>}
          </Stack>
          <Avatar
            sx={{
              backgroundColor: iconBackgroundColor,
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>{icon}</SvgIcon>
          </Avatar>
        </Stack>
        {bottom}
      </CardContent>
    </Card>
  )
}
