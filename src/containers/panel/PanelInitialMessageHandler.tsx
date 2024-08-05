import { t } from '@lingui/macro'
import { AlertColor } from '@mui/material'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSnackbar } from 'src/core/snackbar'
import type { apiMessages } from 'src/shared/constants'
import { LiteralUnion } from 'src/shared/types/shared'
import { getLocationSearchValues, removeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'

type APIMessages = typeof apiMessages
type PanelMessagesTypes = APIMessages[keyof APIMessages]

const getPanelMessages = (
  message: LiteralUnion<PanelMessagesTypes, string>,
): { text: string; type: AlertColor; confetti?: boolean } | void => {
  switch (message) {
    case 'aws-marketplace-subscribed':
      return { text: t`AWS Marketplace has been successfully subscribed`, type: 'success' } as const
    case 'stripe-subscribed':
      return { text: t`Credit/Debit Card has been successfully subscribed`, type: 'success', confetti: true } as const
  }
}

export const PanelInitialMessageHandler = () => {
  const [getSearch] = useSearchParams()
  const message = getSearch.get('message')
  const { showSnackbar } = useSnackbar()
  useEffect(() => {
    if (message) {
      const foundMessage = getPanelMessages(message)
      if (foundMessage) {
        showSnackbar(foundMessage.text, {
          severity: foundMessage.type,
        })
      }
      window.location.search = removeLocationSearchValues(getLocationSearchValues(), 'message')
    }
  }, [message, showSnackbar])
  return <></>
}
