import { Card, CardContent, CardHeader, Typography, styled } from '@mui/material'
import { Account } from 'src/shared/types/server'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { useScaleSequentialMaterialRdYwGn } from 'src/shared/utils/useScaleSequentialMaterialRdYwGn'

const AccountCardContainer = styled(Card, { shouldForwardProp })<{ background: string }>(({ background, theme }) => ({
  background,
  color: theme.palette.common.white,
}))

export const AccountCard = ({ account, score }: { account: Account; score?: number }) => {
  return (
    <AccountCardContainer background={scale(score)}>
      <CardContent>
        <Typography>ID: {account.id}</Typography>
        <Typography>Cloud: {account.cloud.toUpperCase()}</Typography>
        {score !== undefined ? <Typography>Score: {score}</Typography> : undefined}
      </CardContent>
    </AccountCardContainer>
  )
}
