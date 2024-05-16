import { FullTextTerm, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormFullTextSearchValue } from './InventoryFormFullTextSearchValue'

export const InventoryFormFullTextSearchItem = ({ fullTextSearch }: { fullTextSearch?: FullTextTerm }) => {
  const { updateFullTextSearch } = useFixQueryParser()
  return (
    <>
      <InventoryFormFullTextSearchValue
        fullTextSearch={fullTextSearch?.text ?? ''}
        onChange={(value) => updateFullTextSearch(value, fullTextSearch?.text)}
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
