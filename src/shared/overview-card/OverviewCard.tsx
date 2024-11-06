import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  CardContent,
  Icon,
  Stack,
  SvgIcon,
  Typography,
  accordionDetailsClasses,
  accordionSummaryClasses,
} from '@mui/material'
import { ReactNode } from 'react'
import { KeyboardArrowDownIcon } from 'src/assets/icons'

interface OverviewCardProps {
  height?: number
  minHeight?: number
  title?: ReactNode
  value?: ReactNode
  icon?: ReactNode
  iconBackgroundColor?: string
  bottomContent?: ReactNode
  expandableContent?: ReactNode
  alwaysShowExpandable?: boolean
}

export const OverviewCard = ({
  height,
  minHeight,
  title,
  value,
  icon,
  iconBackgroundColor,
  bottomContent,
  expandableContent,
  alwaysShowExpandable,
}: OverviewCardProps) => {
  const bottom = bottomContent ? (
    <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
      {expandableContent && !alwaysShowExpandable ? (
        <Accordion elevation={0} disableGutters square sx={{ background: 'none', width: '100%', '&::before': { content: 'none' } }}>
          <AccordionSummary
            expandIcon={
              <Icon fontSize="small">
                <KeyboardArrowDownIcon />
              </Icon>
            }
            sx={{ p: 0, minHeight: 0, [`.${accordionSummaryClasses.content}`]: { m: 0 } }}
          >
            {bottomContent}
          </AccordionSummary>
          <AccordionDetails
            sx={{
              [`&.${accordionDetailsClasses.root}`]: {
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
    <Card sx={{ height: height ? `${height}px` : undefined, minHeight: minHeight ? `${minHeight}px` : undefined, bgcolor: 'common.white' }}>
      <CardContent component={Stack} direction="column" height="100%">
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3} flexGrow={1}>
          <Stack spacing={1}>
            {title && (
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
            )}
            {value && (
              <Typography variant="h5" component="span">
                {value}
              </Typography>
            )}
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
        {expandableContent && alwaysShowExpandable ? expandableContent : null}
      </CardContent>
    </Card>
  )
}
