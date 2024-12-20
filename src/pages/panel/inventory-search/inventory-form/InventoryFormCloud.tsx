import { t } from '@lingui/macro'
import { useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormCloudValues } from './InventoryFormCloudValues'
import { InventoryFormField } from './InventoryFormField'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormCloud = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { cloud, deleteCloudAccountRegion } = useFixQueryParser()
  const isId = cloud?.path.parts.at(-1)?.name === 'id'
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const values = termValueToStringArray(cloud?.value)
  return values.length ? (
    <>
      <InventoryFormField
        value={cloud}
        label={t`Clouds`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deleteCloudAccountRegion('cloud', !isId)}
        // endIcon={open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />}
      />
      <InventoryFormCloudValues onClose={() => setOpen(null)} open={open} preItems={preItems} values={values} />
    </>
  ) : null
}
