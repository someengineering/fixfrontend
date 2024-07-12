import { t } from '@lingui/macro'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useCallback, useMemo, useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { InventoryFormField } from './InventoryFormField'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormAccount = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { account, setCloudAccountRegion, deleteCloudAccountRegion, changeCloudAccountRegionFromIdToName } = useFixQueryParser()
  const isId = account?.path.parts.at(-1)?.name === 'id'
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  let values = termValueToStringArray(account?.value)
  if (isId && preItems.accounts.length) {
    values = values.map((value) => preItems.accounts.find((i) => i.id === value)?.value).filter((i) => i) as string[]
    window.setTimeout(() => {
      changeCloudAccountRegionFromIdToName('account', values, 'in')
    })
  }
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
    valuesToAdd.forEach((value) => result.push({ label: value, value, id: value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.accounts])

  const handleChange = useCallback(
    (values: string[]) => {
      if (isId) {
        deleteCloudAccountRegion('account')
      }
      if (values) {
        setCloudAccountRegion('account', 'in', values, true)
      } else {
        deleteCloudAccountRegion('account', true)
      }
    },
    [deleteCloudAccountRegion, isId, setCloudAccountRegion],
  )

  return (
    <>
      <InventoryFormField
        value={account}
        label={t`Accounts`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deleteCloudAccountRegion('account', !isId)}
        // endIcon={open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />}
      />
      <InventoryFormDefaultValue
        onChange={handleChange}
        values={values}
        label={t`Account`}
        onClose={() => setOpen(null)}
        open={open}
        options={accountOptions}
      />
    </>
  )
}
