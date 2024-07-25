import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { WorkspaceInventorySearchTableHistory } from 'src/shared/types/server'
import { InventoryFormChangeValue } from './InventoryFormChangesValue'

export const InventoryFormChanges = () => {
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
    </>
  )
}
