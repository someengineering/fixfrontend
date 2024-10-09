import { Trans } from '@lingui/macro'
import { IconButton, Tooltip } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { DownloadIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'

type BasicType = string | number | Date | null | undefined | boolean

interface DownloadCSVButtonProps {
  filename: string
  data: BasicType[][]
}

export const DownloadCSVButton = forwardRef(({ data, filename }: DownloadCSVButtonProps, ref: ForwardedRef<HTMLButtonElement | null>) => {
  const exportToCsv = () => {
    const csvFile = data
      .map((row: BasicType[]) =>
        row
          .map((col) => {
            if (col instanceof Date) {
              return col.toISOString()
            } else {
              const result = col?.toString().replace(/"/g, '""') ?? ''
              return result.search(/("|,|\n)/g) >= 0 ? `"${result}"` : result
            }
          })
          .join(','),
      )
      .join('\n')

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
    const link = window.document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
    }
  }

  return (
    <Tooltip title={<Trans>Download CSV</Trans>} arrow>
      <IconButton
        color="primary"
        ref={ref}
        sx={{ borderRadius: '6px', border: `1px solid ${panelUI.uiThemePalette.input.border}` }}
        onClick={exportToCsv}
      >
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  )
})
