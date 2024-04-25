import { t } from '@lingui/macro'
import { useRef, useState } from 'react'
import { DefaultPropertiesKeys, Path, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormPopover } from './InventoryFormPopover'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormCloud = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    cloud,
    update: {
      current: { setPredicate, deletePredicate },
    },
  } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const { current: path } = useRef(Path.from_string(DefaultPropertiesKeys.Cloud))
  return (
    <>
      <InventoryFormField
        value={cloud ? `${cloud.op} ${JSON.stringify(cloud.value)}` : undefined}
        label={t`Cloud`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deletePredicate(DefaultPropertiesKeys.Cloud)}
      />
      <InventoryFormPopover
        fqn="string"
        onChange={(term) => {
          if (term) {
            setPredicate(DefaultPropertiesKeys.Cloud, term.op, term.value)
          } else {
            deletePredicate(DefaultPropertiesKeys.Cloud)
          }
        }}
        defaultPath={path}
        onClose={() => setOpen(null)}
        open={open}
        preItems={preItems}
        term={cloud}
        id={1}
      />
    </>
  )
}
