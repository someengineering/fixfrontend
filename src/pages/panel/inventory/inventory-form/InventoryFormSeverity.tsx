import { t } from '@lingui/macro'
import { useRef, useState } from 'react'
import { DefaultPropertiesKeys, Path, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormPopover } from './InventoryFormPopover'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormSeverity = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    severity,
    update: {
      current: { setPredicate, deletePredicate },
    },
  } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const { current: path } = useRef(Path.from_string(DefaultPropertiesKeys.Severity))
  return (
    <>
      <InventoryFormField
        value={severity ? `${severity.op} ${JSON.stringify(severity.value)}` : undefined}
        label={t`Severity`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deletePredicate(DefaultPropertiesKeys.Severity)}
      />
      <InventoryFormPopover
        fqn="string"
        onChange={(term) => {
          if (term) {
            setPredicate(DefaultPropertiesKeys.Severity, term.op, term.value)
          } else {
            deletePredicate(DefaultPropertiesKeys.Severity)
          }
        }}
        defaultOp="in"
        onClose={() => setOpen(null)}
        defaultPath={path}
        open={open}
        preItems={preItems}
        term={severity}
        id={4}
      />
    </>
  )
}
