import { t } from '@lingui/macro'
import { useRef, useState } from 'react'
import { DefaultPropertiesKeys, Path, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormPopover } from './InventoryFormPopover'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormRegion = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    region,
    update: {
      current: { setPredicate, deletePredicate },
    },
  } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const { current: path } = useRef(Path.from_string(DefaultPropertiesKeys.Region))
  return (
    <>
      <InventoryFormField
        value={region ? `${region.op} ${JSON.stringify(region.value)}` : undefined}
        label={t`Regions`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deletePredicate(DefaultPropertiesKeys.Region)}
      />
      <InventoryFormPopover
        fqn="string"
        onChange={(term) => {
          if (term) {
            setPredicate(DefaultPropertiesKeys.Region, term.op, term.value)
          } else {
            deletePredicate(DefaultPropertiesKeys.Region)
          }
        }}
        defaultPath={path}
        onClose={() => setOpen(null)}
        open={open}
        preItems={preItems}
        term={region}
        id={3}
      />
    </>
  )
}
