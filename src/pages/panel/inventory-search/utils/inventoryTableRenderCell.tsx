import { t } from '@lingui/macro'
import { Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid-premium'
import { CheckIcon, CloseIcon, QuestionMarkIcon } from 'src/assets/icons'
import { getIconFromResource } from 'src/assets/raw-icons'
import { renderNodeChangeCell } from 'src/pages/panel/shared/utils'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { WorkspaceInventorySearchTableColumn, WorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { AccountCloud, ResourceKind } from 'src/shared/types/server-shared'
import { ColType } from './ColType'
import { InventoryTableDateRenderCell } from './InventoryTableDateRenderCell'
import { InventoryTableKindRenderCell } from './InventoryTableKindRenderCell'

export const inventoryTableRenderCell = (
  col: WorkspaceInventorySearchTableColumn,
  modelData?: Record<string, ResourceKind>,
): ColType['renderCell'] => {
  switch (col.kind) {
    case 'boolean':
      return (params: GridRenderCellParams) =>
        params.value === null || params.value === undefined || params.value === 'null' ? (
          <Tooltip title={t`Undefined`} arrow>
            <QuestionMarkIcon width={20} height={20} />
          </Tooltip>
        ) : params.value && params.value !== 'false' ? (
          <Tooltip title={t`Yes`} arrow>
            <CheckIcon width={20} height={20} />
          </Tooltip>
        ) : (
          <Tooltip title={t`No`} arrow>
            <CloseIcon width={20} height={20} />
          </Tooltip>
        )
    case 'datetime':
    case 'date':
      return (params: GridRenderCellParams) => <InventoryTableDateRenderCell value={params.value as Date} />
  }
  switch (col.path) {
    case '/change':
      return renderNodeChangeCell
    case '/ancestors.cloud.reported.name':
    case '/ancestors.cloud.reported.id':
      return (params: GridRenderCellParams<WorkspaceInventorySearchTableRow['row']>) =>
        params.row.cloud ? <CloudAvatar cloud={params.row.cloud as AccountCloud} small tooltip /> : '-'
    case '/reported.kind':
      return modelData
        ? (params: GridRenderCellParams<WorkspaceInventorySearchTableRow['row']>) => {
            const value = params.value as string
            const model = modelData?.[value]
            return model && 'metadata' in model && model.metadata && (model.metadata.icon || model.metadata.name) ? (
              <InventoryTableKindRenderCell
                name={(typeof model.metadata.name === 'string' && model.metadata.name) || value}
                group={typeof model.metadata.group === 'string' ? model.metadata.group : ''}
                iconUrl={
                  typeof model.metadata.icon === 'string' && model.metadata.icon ? getIconFromResource(model.metadata.icon) : undefined
                }
              />
            ) : (
              value
            )
          }
        : undefined
  }
  return
}
