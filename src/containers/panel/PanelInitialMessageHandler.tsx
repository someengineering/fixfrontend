import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSnackbar } from 'src/core/snackbar'
import { panelMessages } from 'src/shared/constants'

export const PanelInitialMessageHandler = () => {
  const [getSearch, setSearch] = useSearchParams()
  const { showSnackbar } = useSnackbar()
  useEffect(() => {
    const message = getSearch.get('message')
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
  }, [getSearch, setSearch, showSnackbar])
  return <></>
}
