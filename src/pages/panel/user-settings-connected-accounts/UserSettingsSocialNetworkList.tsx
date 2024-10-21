import { Divider } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { useUserProfile } from 'src/core/auth'
import { UserSettingsSocialNetwork } from './UserSettingsSocialNetwork'
import { getOAuthAssociateQuery } from './getOAuthAssociate.query'

export const UserSettingsSocialNetworkList = () => {
  const { currentUser } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['oauth-associate', window.location.pathname + window.location.search, currentUser?.id],
    queryFn: getOAuthAssociateQuery,
  })
  return data.map((item, i) => (
    <Fragment key={i}>
      <UserSettingsSocialNetwork {...item} />
      {i !== data.length - 1 ? <Divider flexItem /> : null}
    </Fragment>
  ))
}
