import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react'

interface ButtonRegionContextValue {
  content: ReactNode
  setContent: (content: ReactNode) => void
}

export const ButtonsRegionContext = createContext<ButtonRegionContextValue>({ content: null, setContent: () => {} })

export const ButtonsRegionProvider = ({ children }: PropsWithChildren) => {
  const [content, setContent] = useState<ReactNode>(null)

  return (
    <>
      <ButtonsRegionContext.Provider value={{ content, setContent }}>{children}</ButtonsRegionContext.Provider>
    </>
  )
}

export const ButtonsRegion = ({ children }: PropsWithChildren) => {
  const { setContent } = useContext(ButtonsRegionContext)

  useEffect(() => {
    setContent(children)
    return () => setContent(null)
  }, [children, setContent])

  return null
}
