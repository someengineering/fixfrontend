import { t } from '@lingui/macro'
import { useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormKindPopover } from './InventoryFormKindPopover'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormKind = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    is,
    update: {
      current: { setIs, deleteIs },
    },
  } = useFixQueryParser()
  const term = is()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  return (
    <>
      <InventoryFormField
        value={term?.kinds.map(snakeCaseWordsToUFStr).join(', ')}
        label={t`Kinds`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={deleteIs}
      />
      <InventoryFormKindPopover
        onChange={(values) => (values.length ? setIs(values) : deleteIs())}
        kinds={term?.kinds ?? []}
        onClose={() => setOpen(null)}
        open={open}
        options={preItems.kinds}
      />
    </>
  )
}
