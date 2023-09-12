import { Trans } from '@lingui/macro'
import { Spinner } from './Spinner'

// TODO: check styles here

export const Loading = () => {
  return (
    <>
      <Trans>Loading...</Trans>
      <Spinner />
    </>
  )
}
