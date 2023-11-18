import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { AbsoluteNavigateInnerProvider } from './AbsoluteNavigateInnerProvider'

export const AbsoluteNavigateProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  return <AbsoluteNavigateInnerProvider useNavigate={navigate}>{children}</AbsoluteNavigateInnerProvider>
}
