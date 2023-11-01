import { Trans } from '@lingui/macro'
import { Card, CardContent, CardHeader, Tooltip, Typography, TypographyProps, styled } from '@mui/material'
import { colorFromRedToGreen } from 'src/shared/constants'
import { WorkspaceAccountReportSummary } from 'src/shared/types/server'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

const AccountCardContainer = styled(Card, { shouldForwardProp })<{ score?: number }>(({ theme, score }) => ({
  background: score ? colorFromRedToGreen[score] : theme.palette.info.main,
  color: theme.palette.common.white,
  width: '100%',
  '.MuiCardHeader-content': {
    width: '100%',
  },
}))

const CardText = (props: Omit<TypographyProps, 'whiteSpace' | 'textOverflow' | 'overflow' | 'width'>) => {
  return (
    <Tooltip title={props.children}>
      <Typography {...props} whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" width="100%" />
    </Tooltip>
  )
}

export const AccountCard = ({ account }: { account: WorkspaceAccountReportSummary }) => {
  return (
    <AccountCardContainer score={account.score}>
      <CardHeader title={<CardText variant="h5">{snakeCaseWordsToUFStr(account.name ?? account.id)}</CardText>} />
      <CardContent>
        <CardText>
          <Trans>ID</Trans>: {account.id}
        </CardText>
        <CardText>
          <Trans>Cloud</Trans>: {account.cloud?.toUpperCase()}
        </CardText>
        {account.score !== undefined ? <CardText>Score: {account.score}</CardText> : undefined}
      </CardContent>
    </AccountCardContainer>
  )
}
