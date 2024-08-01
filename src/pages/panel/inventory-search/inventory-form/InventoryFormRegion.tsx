import { t } from '@lingui/macro'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormRegionValues } from './InventoryFormRegionValues'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormRegion = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { region, deleteCloudAccountRegion } = useFixQueryParser()
  const isId = region?.path.parts.at(-1)?.name === 'id'
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const values = termValueToStringArray(region?.value)
  return values.length ? (
    <>
      <InventoryFormField
        value={region}
        label={t`Regions`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deleteCloudAccountRegion('region', !isId)}
        // endIcon={open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />}
      />
      <InventoryFormRegionValues onClose={() => setOpen(null)} open={open} preItems={preItems} values={values} />
    </>
  ) : null
}
