import { Card, CardContent, CardHeader, Typography, styled } from '@mui/material'
import { colorFromRedToGreen } from 'src/shared/constants'
import { Account } from 'src/shared/types/server'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

const AccountCardContainer = styled(Card, { shouldForwardProp })<{ background: string }>(({ background, theme }) => ({
  background,
  color: theme.palette.common.white,
}))

export const AccountCard = ({ account, score }: { account: Account; score?: number }) => {
  return (
    <AccountCardContainer background={score !== undefined ? colorFromRedToGreen[score] : 'info.main'}>
      <CardHeader title={snakeCaseWordsToUFStr(account.name ?? account.id)} />
      <CardContent>
        <Typography>ID: {account.id}</Typography>
        <Typography>Cloud: {account.cloud?.toUpperCase()}</Typography>
        {score !== undefined ? <Typography>Score: {score}</Typography> : undefined}
      </CardContent>
    </AccountCardContainer>
  )
}
