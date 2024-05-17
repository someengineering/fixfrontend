import { MouseEvent as ReactMouseEvent } from 'react'

export const handleScrollIntoViewClickEvent = (e: ReactMouseEvent<HTMLElement, MouseEvent>) => {
  e.preventDefault()
  const href = e.currentTarget.getAttribute('href')
  if (href) {
    window.document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }
}
