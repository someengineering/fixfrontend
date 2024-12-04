import { IconButton, Menu, MenuItem, Stack } from '@mui/material'
import { MouseEvent as ReactMouseEvent, useState } from 'react'
import { MoreVertIcon } from 'src/assets/icons'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'
import { useCopyString } from 'src/shared/utils/useCopyString'
import { ComplianceCheckCollectionNodeWithChildren } from './ComplianceDetailTreeItem'

interface ComplianceDetailTreeItemTableMenuProps {
  check: ComplianceCheckCollectionNodeWithChildren & { reported: BenchmarkCheckResultNode }
  accountName?: string
}

export const ComplianceDetailTreeItemTableMenu = ({ check }: ComplianceDetailTreeItemTableMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const copy = useCopyString()
  const open = Boolean(anchorEl)
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleCopyLink = (event: ReactMouseEvent<HTMLLIElement>) => {
    event.stopPropagation()
    event.preventDefault()
    handleClose()
    copy(`${window.location.href.split('?')[0].split('/check-detail')[0]}/check-detail/${check.reported.id}`)
  }
  return (
    <Stack alignItems="center" justifyContent="center">
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={(e) => {
          if ('preventDefault' in e && typeof e.preventDefault === 'function') {
            e.preventDefault()
          }
          if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
            e.stopPropagation()
          }
          handleClose()
        }}
      >
        <MenuItem onClick={handleCopyLink}>Copy link to this view</MenuItem>
      </Menu>
    </Stack>
  )
}
