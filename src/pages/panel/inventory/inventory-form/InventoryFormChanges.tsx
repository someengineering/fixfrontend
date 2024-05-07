import { Box, Divider } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { InventoryFormChangeValue } from './InventoryFormChangesValue'

export const InventoryFormChangesComp = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsChanges = searchParams.get('changes')?.split(',') ?? null
  const searchParamsAfter = searchParams.get('after')
  const searchParamsBefore = searchParams.get('before')

  const handleReset = () => {
    setSearchParams((searchParams) => {
      searchParams.delete('changes')
      searchParams.delete('after')
      searchParams.delete('before')
      return searchParams
    })
  }

  const handleSubmit = (searchParamsChanges: string[] | null, searchParamsAfter: string | null, searchParamsBefore: string | null) => {
    if (searchParamsChanges && searchParamsAfter && searchParamsBefore) {
      setSearchParams((searchParams) => {
        searchParams.set('changes', searchParamsChanges.join(','))
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
      <InventoryFormChangeValue
        onChange={handleSubmit}
        searchParamsAfter={searchParamsAfter}
        searchParamsBefore={searchParamsBefore}
        searchParamsChanges={searchParamsChanges}
      />
      <Box width="100%" flexGrow={1}>
        <Divider />
      </Box>
    </>
  )
}

export const InventoryFormChanges = () => {
  const [searchParams] = useSearchParams()
  const hasChanges = searchParams.get('changes') ?? ''
  return hasChanges ? <InventoryFormChangesComp /> : null
}
