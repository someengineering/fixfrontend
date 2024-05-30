import { Link } from '@mui/material'
import { Fragment } from 'react'

const urlRegex = /https:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]+/g

export const extractAndSplitUrlFromText = (str: string) => {
  const urls = str.match(urlRegex) || []
  const parts = str.split(urlRegex)

  return parts.length > 1
    ? parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {urls[index] ? (
            <Link target="_blank" href={urls[index]} rel="noopener noreferrer" sx={{ display: 'inline' }}>
              {urls[index]}
            </Link>
          ) : null}
        </Fragment>
      ))
    : str
}
