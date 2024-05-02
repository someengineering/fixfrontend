import { useMemo } from 'react'
import { DefaultPropertiesKeys, FixQueryContextValue, Predicate, useFixQueryParser } from 'src/shared/fix-query-parser'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { InventoryFormField } from './InventoryFormField'
import { InventoryFormValue } from './InventoryFormValue'
import { AutoCompletePreDefinedItems } from './utils'

const INDEX_STARTS_FROM = 5

interface InventoryFormRestItemProps {
  term: Predicate
  update: FixQueryContextValue['update']
  index: number
  preItems: AutoCompletePreDefinedItems
}

const InventoryFormRestItem = ({ term, update, index, preItems }: InventoryFormRestItemProps) => {
  const {
    current: { deletePredicate, setPredicate },
  } = update
  const [LastPath, path] = useMemo(
    () => [
      snakeCaseWordsToUFStr(
        term.path.parts.length > 1
          ? term.path.parts
              .slice(-2)
              .map((i) => i.name)
              .join(' ')
          : term.path.toString(),
      ),
      term.path.toString(),
    ],
    [term.path],
  )
  return (
    <>
      <InventoryFormField label={LastPath} onClear={() => deletePredicate(path)} forceShowClearButton>
        <InventoryFormValue
          onChange={(term) => {
            if (term && term.value !== '') {
              setPredicate(path, term.op, term.value)
            } else {
              deletePredicate(path)
            }
          }}
          preItems={preItems}
          defaultPath={term.path}
          term={term}
          id={index + INDEX_STARTS_FROM}
        />
      </InventoryFormField>
    </>
  )
}

export const InventoryFormRest = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { query, update } = useFixQueryParser()

  const predicates = useMemo(
    () =>
      query.predicates().filter((term) => !Object.values(DefaultPropertiesKeys).includes(term.path.toString() as DefaultPropertiesKeys)),
    [query],
  )

  return (
    <>
      {predicates.map((term, i) => (
        <InventoryFormRestItem key={i} term={term} update={update} index={i} preItems={preItems} />
      ))}
    </>
  )
}
