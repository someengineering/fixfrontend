import { NavigateProps } from 'react-router-dom'
import { useAbsoluteNavigate } from './useAbsoluteNavigate'

export const Navigate = ({ to, replace, state, relative }: NavigateProps) => {
  const navigate = useAbsoluteNavigate(true)
  if (navigate) {
    navigate(to, { replace, state: state as unknown, relative })
  } else {
    window.location.href = typeof to === 'string' ? to : `${to.pathname}${to.search}${to.hash}`
  }
  return null
}
