import { t } from '@lingui/macro'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useMemo, useState } from 'react'
import { DefaultPropertiesKeys, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { InventoryFormField } from './InventoryFormField'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormAccount = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { account, setPredicate, deletePredicate } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const values = termValueToStringArray(account?.value)
  const accountOptions = useMemo(() => {
    const valuesToAdd = [...values]
    const result = [...preItems.accounts]
    for (const account of preItems.accounts) {
      let index = valuesToAdd.indexOf(account.value)
      if (index === -1) {
        index = valuesToAdd.indexOf(account.label)
      }
      if (index > -1) {
        valuesToAdd.splice(index, 1)
      }
    }
    valuesToAdd.forEach((value) => result.push({ label: value, value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.accounts])
  return (
    <>
      <InventoryFormField
        value={account}
        label={t`Accounts`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deletePredicate(DefaultPropertiesKeys.Account)}
        // endIcon={open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />}
      />
      <InventoryFormDefaultValue
        onChange={(values) =>
          values.length ? setPredicate(DefaultPropertiesKeys.Account, 'in', values) : deletePredicate(DefaultPropertiesKeys.Account)
        }
        values={values}
        label={t`Account`}
        onClose={() => setOpen(null)}
        open={open}
        options={accountOptions}
      />
    </>
  )
}
