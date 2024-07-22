import { t } from '@lingui/macro'

export const oneTwoThreeWordedNumber = (number: number) =>
  number === 1 ? t`One` : number === 2 ? t`Two` : number === 3 ? t`Three` : number.toString()
