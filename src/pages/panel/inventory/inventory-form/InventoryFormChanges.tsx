import { Trans, t } from '@lingui/macro'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from 'src/shared/modal'
import { InventoryFormField } from './InventoryFormField'

export const InventoryFormChangesComp = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsChange = searchParams.get('change')
  const searchParamsAfter = searchParams.get('after')
  const searchParamsBefore = searchParams.get('before')
  const [change, setChange] = useState(searchParamsChange ?? '')
  const [after, setAfter] = useState(searchParamsAfter)
  const [before, setBefore] = useState(searchParamsBefore)
  const modalRef = useRef<(show?: boolean | undefined) => void>()

  useEffect(() => {
    setChange(searchParamsChange ?? '')
    setAfter(searchParamsAfter)
    setBefore(searchParamsBefore)
  }, [searchParamsChange, searchParamsAfter, searchParamsBefore])

  const handleReset = () => {
    setSearchParams((searchParams) => {
      searchParams.delete('change')
      searchParams.delete('after')
      searchParams.delete('before')
      return searchParams
    })
    setChange('')
    setAfter('')
    setBefore('')
  }

  const handleSubmit = () => {
    if (after && before) {
      setSearchParams((searchParams) => {
        searchParams.set('change', change)
        searchParams.set('after', after)
        searchParams.set('before', before)
        return searchParams
      })
      modalRef.current?.(false)
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
        onClick={() => modalRef.current?.(true)}
        onClear={handleReset}
      />
      <Modal
        openRef={modalRef}
        title={t`Inventory Changes`}
        onSubmit={handleSubmit}
        onClose={handleSubmit}
        actions={
          <>
            <Button color="primary" onClick={() => modalRef.current?.(false)}>
              <Trans>Close</Trans>
            </Button>
            <Button type="submit" color="primary" disabled={!after || !before || !change}>
              <Trans>Submit</Trans>
            </Button>
          </>
        }
      >
        <Stack direction="row" flexWrap="wrap">
          <FormControl>
            <InputLabel id="change-type">
              <Trans>Change Type</Trans>
            </InputLabel>
            <Select
              sx={{ minWidth: 200, mb: 1, mr: 1, height: '100%' }}
              value={change}
              variant="outlined"
              onChange={(e) => setChange(e.target.value)}
              size="small"
              autoFocus={!change}
              label={t`Change Type`}
              labelId="change-type"
            >
              <MenuItem value="node_created">
                <Trans>Node Created</Trans>
              </MenuItem>
              <MenuItem value="node_updated">
                <Trans>Node Updated</Trans>
              </MenuItem>
              <MenuItem value="node_deleted">
                <Trans>Node Deleted</Trans>
              </MenuItem>
              <MenuItem value="node_vulnerable">
                <Trans>Node Vulnerable</Trans>
              </MenuItem>
              <MenuItem value="node_compliant">
                <Trans>Node Compliant</Trans>
              </MenuItem>
            </Select>
          </FormControl>
          <DateTimeRangePicker
            sx={{ mb: 1 }}
            defaultValue={[after ? dayjs(after) : null, before ? dayjs(before) : null]}
            onChange={([after, before]) => {
              setAfter(after?.toISOString() ?? null)
              setBefore(before?.toISOString() ?? null)
            }}
          />
        </Stack>
      </Modal>
    </>
  )
}

export const InventoryFormChanges = () => {
  const [searchParams] = useSearchParams()
  const hasChanges = (searchParams.get('changes') ?? '') === 'true'
  return hasChanges ? <InventoryFormChangesComp /> : null
}
