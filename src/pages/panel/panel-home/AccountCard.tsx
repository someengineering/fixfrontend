import { Card, CardContent, CardHeader, Typography, styled } from '@mui/material'
import { WorkspaceAccount } from 'src/shared/types/server'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { useScaleSequentialMaterialRdYwGn } from 'src/shared/utils/useScaleSequentialMaterialRdYwGn'

const AccountCardContainer = styled(Card, { shouldForwardProp })<{ background: string }>(({ background, theme }) => ({
  background,
  color: theme.palette.common.white,
}))

export const AccountCard = ({ account }: { account: WorkspaceAccount }) => {
  const scale = useScaleSequentialMaterialRdYwGn(50, 100)
  return (
    <AccountCardContainer background={scale(account.score)}>
      <CardHeader title={`${account.name}`} />
      <CardContent>
        <Typography>Id: {account.id}</Typography>
        <Typography>Cloud: {account.cloud}</Typography>
        <Typography>Score: {account.score}</Typography>
      </CardContent>
    </AccountCardContainer>
  )
}
