import { Trans } from '@lingui/macro'
import { Card, CardContent, CardHeader, Tooltip, Typography, TypographyProps, cardHeaderClasses, styled } from '@mui/material'
import { colorFromRedToGreen } from 'src/shared/constants'
import { WorkspaceAccountReportSummary } from 'src/shared/types/server'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'

const AccountCardContainer = styled(Card, { shouldForwardProp })<{ score?: number }>(({ theme, score }) => ({
  background: score ? colorFromRedToGreen[score] : theme.palette.info.main,
  color: theme.palette.common.white,
  width: '100%',
  [`.${cardHeaderClasses.content}`]: {
    width: '100%',
  },
}))

const CardText = (props: Omit<TypographyProps, 'whiteSpace' | 'textOverflow' | 'overflow' | 'width'>) => {
  return (
    <Tooltip title={props.children} arrow>
      <Typography {...props} whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" width="100%" />
    </Tooltip>
  )
}

interface AccountCardProps {
  account: WorkspaceAccountReportSummary
}

export const AccountCard = ({ account }: AccountCardProps) => {
  return (
    <AccountCardContainer score={account.score}>
      <CardHeader title={<CardText variant="h5">{account.name ?? account.id}</CardText>} />
      <CardContent>
        <CardText>
          <Trans>ID</Trans>: {account.id}
        </CardText>
        <CardText>
          <Trans>Cloud</Trans>: {account.cloud ? getAccountCloudName(account.cloud) : '-'}
        </CardText>
        {account.score !== undefined ? <CardText>Score: {account.score}</CardText> : undefined}
      </CardContent>
    </AccountCardContainer>
  )
}
