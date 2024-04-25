import { t } from '@lingui/macro'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { InventoryFormChangePopover } from './InventoryFormChangesPopover'
import { InventoryFormField } from './InventoryFormField'

export const InventoryFormChangesComp = () => {
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsChange = searchParams.get('change')
  const searchParamsAfter = searchParams.get('after')
  const searchParamsBefore = searchParams.get('before')

  const handleReset = () => {
    setSearchParams((searchParams) => {
      searchParams.delete('change')
      searchParams.delete('after')
      searchParams.delete('before')
      return searchParams
    })
  }

  const handleSubmit = (searchParamsChange: string | null, searchParamsAfter: string | null, searchParamsBefore: string | null) => {
    if (searchParamsChange && searchParamsAfter && searchParamsBefore) {
      setSearchParams((searchParams) => {
        searchParams.set('change', searchParamsChange)
        searchParams.set('after', searchParamsAfter)
        searchParams.set('before', searchParamsBefore)
        return searchParams
      })
    } else {
      handleReset()
    }
  }

  return (
    <>
      <InventoryFormField
        value={
          searchParamsChange && searchParamsBefore && searchParamsAfter
            ? t`${searchParamsChange} From ${searchParamsAfter} to ${searchParamsBefore}`
            : undefined
        }
        label={t`Changes`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={handleReset}
      />
      <InventoryFormChangePopover
        onChange={handleSubmit}
        onClose={() => setOpen(null)}
        open={open}
        searchParamsAfter={searchParamsAfter}
        searchParamsBefore={searchParamsBefore}
        searchParamsChange={searchParamsChange}
      />
    </>
  )
}

export const InventoryFormChanges = () => {
  const [searchParams] = useSearchParams()
  const hasChanges = (searchParams.get('changes') ?? '') === 'true'
  return hasChanges ? <InventoryFormChangesComp /> : null
}
