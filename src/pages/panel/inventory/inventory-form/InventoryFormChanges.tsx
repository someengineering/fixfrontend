import { Box, Divider } from '@mui/material'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { WorkspaceInventorySearchTableHistory } from 'src/shared/types/server'
import { InventoryFormChangeValue } from './InventoryFormChangesValue'

export const InventoryFormChangesComp = () => {
  const { history, onHistoryChange } = useFixQueryParser()

  const handleSubmit = (searchParamsChanges: string[] | null, searchParamsAfter: string | null, searchParamsBefore: string | null) => {
    onHistoryChange({
      changes: (searchParamsChanges ?? []) as WorkspaceInventorySearchTableHistory['changes'],
      after: searchParamsAfter,
      before: searchParamsBefore,
    })
  }

  return (
    <>
      <InventoryFormChangeValue
        onChange={handleSubmit}
        searchParamsAfter={history.after ?? null}
        searchParamsBefore={history.before ?? null}
        searchParamsChanges={history.changes}
      />
      <Box width="100%" flexGrow={1}>
        <Divider />
      </Box>
    </>
  )
}

export const InventoryFormChanges = () => {
  const { history } = useFixQueryParser()

  return history.changes.length ? <InventoryFormChangesComp /> : null
}
