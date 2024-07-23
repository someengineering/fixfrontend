import { t } from '@lingui/macro'
import { AlertColor } from '@mui/material'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSnackbar } from 'src/core/snackbar'
import { apiMessages } from 'src/shared/constants'
import { LiteralUnion } from 'src/shared/types/shared'

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
  const [getSearch, setSearch] = useSearchParams()
  const message = getSearch.get('message')
  const { showSnackbar } = useSnackbar()
  useEffect(() => {
    if (message) {
      const foundMessage = getPanelMessages(message)
      if (foundMessage) {
        void showSnackbar(foundMessage.text, {
          severity: foundMessage.type,
        })
      }
      setSearch((prev) => {
        prev.delete('message')
        return prev
      })
    }
    // TODO: removed due to problem with setSearchParams changes with every route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, showSnackbar])
  return <></>
}
