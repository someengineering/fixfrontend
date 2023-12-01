import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSnackbar } from 'src/core/snackbar'
import { panelMessages } from 'src/shared/constants'

export const PanelInitialMessageHandler = () => {
  const [getSearch, setSearch] = useSearchParams()
  const message = getSearch.get('message')
  const { showSnackbar } = useSnackbar()
  useEffect(() => {
    if (message) {
      const foundMessage = panelMessages().find((pm) => pm.message === message)
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
    // TODO: removed due to problem with setSeachParams changes with every route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, showSnackbar])
  return <></>
}
