import { t } from '@lingui/macro'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid-premium'
import { getIconFromResource } from 'src/assets/raw-icons'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { WorkspaceInventorySearchTableColumn, WorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { AccountCloud, ResourceKind } from 'src/shared/types/server-shared'
import { ColType } from './ColType'
import { InventoryTableDateRenderCell } from './InventoryTableDateRenderCell'
import { InventoryTableKindRenderCell } from './InventoryTableKindRenderCell'
import { inventoryRenderNodeChangeCell } from './inventoryRenderNodeChangeCell'

export const inventoryTableRenderCell = (
  col: WorkspaceInventorySearchTableColumn,
  modelData?: Record<string, ResourceKind>,
): ColType['renderCell'] => {
  switch (col.kind) {
    case 'boolean':
      return (params: GridRenderCellParams) =>
        params.value === null || params.value === undefined || params.value === 'null' ? (
          <Tooltip title={t`Undefined`} arrow>
            <QuestionMarkIcon fontSize="small" />
          </Tooltip>
        ) : params.value && params.value !== 'false' ? (
          <Tooltip title={t`Yes`} arrow>
            <CheckIcon fontSize="small" />
          </Tooltip>
        ) : (
          <Tooltip title={t`No`} arrow>
            <CloseIcon fontSize="small" />
          </Tooltip>
        )
    case 'datetime':
    case 'date':
      return (params: GridRenderCellParams) => <InventoryTableDateRenderCell value={params.value as Date} />
  }
  switch (col.path) {
    case '/change':
      return inventoryRenderNodeChangeCell
    case '/ancestors.cloud.reported.name':
    case '/ancestors.cloud.reported.id':
      return (params: GridRenderCellParams<WorkspaceInventorySearchTableRow['row']>) => (
        <CloudAvatar cloud={params.row.cloud as AccountCloud} small tooltip />
      )
    case '/reported.kind':
      return modelData
        ? (params: GridRenderCellParams<WorkspaceInventorySearchTableRow['row']>) => {
            const value = params.value as string
            const model = modelData?.[value]
            return model && 'metadata' in model && model.metadata && (model.metadata.icon || model.metadata.name) ? (
              <InventoryTableKindRenderCell
                name={model.metadata.name ?? value}
                group={model.metadata.group}
                iconUrl={model.metadata.icon ? getIconFromResource(model.metadata.icon) : undefined}
              />
            ) : (
              value
            )
          }
        : undefined
  }
  return
}
