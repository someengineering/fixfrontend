import { t } from '@lingui/macro'
import { useCallback, useMemo, useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { InventoryFormField } from './InventoryFormField'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormKind = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { is, setIs, deleteIs } = useFixQueryParser()
  const values = is?.kinds ?? []
  const termOptions = useMemo(() => {
    const valuesToAdd = [...values]
    const result = [...preItems.kinds]
    for (const kind of preItems.kinds) {
      let index = valuesToAdd.indexOf(kind.value)
      if (index === -1) {
        index = valuesToAdd.indexOf(kind.label)
      }
      if (index > -1) {
        valuesToAdd.splice(index, 1)
      }
    }
    valuesToAdd.forEach((value) => result.push({ label: value, value, id: value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.kinds])
  const [open, setOpen] = useState<HTMLDivElement | null>(null)

  const handleChange = useCallback((values: string[]) => (values.length ? setIs(values) : deleteIs()), [deleteIs, setIs])

  return (
    <>
      <InventoryFormField
        value={is}
        label={t`Kinds`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={deleteIs}
        // endIcon={open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />}
      />
      <InventoryFormDefaultValue
        onChange={handleChange}
        values={values}
        label={t`kind`}
        onClose={() => setOpen(null)}
        open={open}
        options={termOptions}
      />
    </>
  )
}
