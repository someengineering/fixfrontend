import { t } from '@lingui/macro'
import { useState } from 'react'
import { FullTextTerm, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormFullTextSearchPopover } from './InventoryFormFullTextSearchPopover'

export const InventoryFormFullTextSearchItem = ({ fullTextSearch }: { fullTextSearch?: FullTextTerm }) => {
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const {
    update: {
      current: { updateFullTextSearch },
    },
  } = useFixQueryParser()
  return (
    <>
      <InventoryFormField
        value={fullTextSearch}
        label={t`Full-text search`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={fullTextSearch ? () => updateFullTextSearch(undefined, fullTextSearch.text) : () => {}}
      />
      <InventoryFormFullTextSearchPopover
        fullTextSearch={fullTextSearch?.text ?? ''}
        onChange={(value) => updateFullTextSearch(value, fullTextSearch?.text)}
        onClose={() => setOpen(null)}
        open={open}
      />
    </>
  )
}

export const InventoryFormFullTextSearches = () => {
  const { fullTextSearches } = useFixQueryParser()

  return fullTextSearches.length ? (
    fullTextSearches.map((fullTextSearch, i) => <InventoryFormFullTextSearchItem fullTextSearch={fullTextSearch} key={i} />)
  ) : (
    <InventoryFormFullTextSearchItem />
  )
}
