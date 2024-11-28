import { IconButton, Menu, MenuItem, Stack } from '@mui/material'
import { MouseEvent as ReactMouseEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MoreVertIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FixQueryParser } from 'src/shared/fix-query-parser'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'
import { useCopyString } from 'src/shared/utils/useCopyString'
import { ComplianceCheckCollectionNodeWithChildren } from './ComplianceDetailTreeItem'

interface ComplianceDetailTreeItemTableMenuProps {
  check: ComplianceCheckCollectionNodeWithChildren & { reported: BenchmarkCheckResultNode }
  accountName?: string
}

export const ComplianceDetailTreeItemTableMenu = ({ check, accountName }: ComplianceDetailTreeItemTableMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useAbsoluteNavigate()
  const copy = useCopyString()
  const { accountId } = useParams<{ accountId: string }>()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleCopyLink = () => {
    handleClose()
    copy(`${window.location.href.split('?')[0].split('/check-detail')[0]}/check-detail/${check.reported.id}`)
  }
  let query: string | undefined
  if (check.reported.detect.fix) {
    let parser = FixQueryParser.parse(check.reported.detect.fix, check.reported.default_values ?? undefined)
    if (accountId) {
      parser = parser.set_cloud_account_region('account', '=', accountName ?? accountId, true)
    }
    query = `/inventory/search?q=${window.encodeURIComponent(parser.toString())}`
  }
  const goToResource = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (query) {
      e.preventDefault()
      e.stopPropagation()
      handleClose()
      navigate(query)
    }
  }
  return (
    <Stack alignItems="center" justifyContent="center">
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleCopyLink}>Copy link to this view</MenuItem>
        {query && (
          <MenuItem component="a" href={query} onClick={goToResource}>
            See resources in explorer
          </MenuItem>
        )}
        {check.reported.url && (
          <MenuItem component="a" href={check.reported.url} target="_blank" rel="noopener noreferrer" onClick={handleClose}>
            Learn more about the risk
          </MenuItem>
        )}
        {check.reported.remediation.url ? (
          <MenuItem component="a" href={check.reported.remediation.url} target="_blank" rel="noopener noreferrer" onClick={handleClose}>
            Remediation guidance
          </MenuItem>
        ) : null}
      </Menu>
    </Stack>
  )
}
