import { t } from '@lingui/macro'
import { useRef, useState } from 'react'
import { DefaultPropertiesKeys, Path, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormPopover } from './InventoryFormPopover'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormAccount = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    account,
    update: {
      current: { setPredicate, deletePredicate },
    },
  } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const { current: path } = useRef(Path.from_string(DefaultPropertiesKeys.Account))
  return (
    <>
      <InventoryFormField
        value={account ? `${account.op} ${JSON.stringify(account.value)}` : undefined}
        label={t`Account`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deletePredicate(DefaultPropertiesKeys.Account)}
      />
      <InventoryFormPopover
        fqn="string"
        onChange={(term) => {
          if (term) {
            setPredicate(DefaultPropertiesKeys.Account, term.op, term.value)
          } else {
            deletePredicate(DefaultPropertiesKeys.Account)
          }
        }}
        defaultPath={path}
        onClose={() => setOpen(null)}
        open={open}
        preItems={preItems}
        term={account}
        id={2}
      />
    </>
  )
}
