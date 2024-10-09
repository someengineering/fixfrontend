import { Trans } from '@lingui/macro'
import { IconButton, Tooltip } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { DownloadIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'

export const DownloadCSVButton = forwardRef((_, ref: ForwardedRef<HTMLButtonElement | null>) => {
  return (
    <Tooltip title={<Trans>Download CSV</Trans>} arrow>
      <IconButton color="primary" ref={ref} sx={{ borderRadius: '6px', border: `1px solid ${panelUI.uiThemePalette.input.border}` }}>
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  )
})
