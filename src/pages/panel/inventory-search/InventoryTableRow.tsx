import { ButtonBase } from '@mui/material'
import { GridRow, GridRowProps } from '@mui/x-data-grid-premium'
import { forwardRef } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { WorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'

export type RowType = WorkspaceInventorySearchTableRow['row'] & {
  INTERNAL_ID: string
}

export const InventoryTableRow = forwardRef<HTMLAnchorElement | null, GridRowProps>((rowProps, ref) => {
  const navigate = useAbsoluteNavigate()
  const id = (rowProps.row as RowType)?.INTERNAL_ID.split('_').slice(0, -1).join('_')
  if (!id || id === 'null' || id === 'undefined') {
    return <GridRow {...rowProps} />
  }
  const search =
    typeof rowProps.row?.name === 'string'
      ? mergeLocationSearchValues({
          ...getLocationSearchValues(window.location.search),
          name: window.encodeURIComponent(rowProps.row?.name ?? '-'),
          ...(typeof rowProps.row?.cloud === 'string' ? { cloud: window.encodeURIComponent(rowProps.row?.cloud ?? '-') } : {}),
        })
      : window.location.search
  const href = `./resource-detail/${id}${search?.[0] === '?' || !search ? (search ?? '') : `?${search}`}`
  return (
    <ButtonBase
      href={href}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(href)
      }}
      ref={ref}
    >
      <GridRow {...rowProps} />
    </ButtonBase>
  )
})
