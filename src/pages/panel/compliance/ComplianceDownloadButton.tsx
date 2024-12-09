import { Trans } from '@lingui/macro'
import { IconButton, Tooltip } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { DownloadIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'

interface ComplianceDownloadButtonProps {
  filename: string
  data: object
}

export const ComplianceDownloadButton = forwardRef(
  ({ data, filename }: ComplianceDownloadButtonProps, ref: ForwardedRef<HTMLButtonElement | null>) => {
    const exportToJSON = () => {
      const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json;charset=utf-8;' })
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
      <Tooltip title={<Trans>Download</Trans>} arrow>
        <IconButton
          color="primary"
          ref={ref}
          sx={{ borderRadius: '6px', border: `1px solid ${panelUI.uiThemePalette.input.border}` }}
          onClick={exportToJSON}
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    )
  },
)
