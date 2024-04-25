import { Trans, t } from '@lingui/macro'
import { Button, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { Modal } from 'src/shared/modal'
import { InventoryFormField } from './InventoryFormField'

export const InventoryFormFullTextSearch = () => {
  const {
    fullTextSearches: [firstFullText],
    update: {
      current: { setFullTextSearchWithIndex, deleteFullTextSearchWithIndex },
    },
  } = useFixQueryParser()
  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const firstFullTextValue = firstFullText?.text ?? ''
  const [value, setValue] = useState(firstFullTextValue)
  useEffect(() => {
    setValue(firstFullTextValue)
  }, [firstFullTextValue])
  return (
    <>
      <InventoryFormField
        value={firstFullTextValue}
        label={t`Full-text search`}
        onClick={() => modalRef.current?.(true)}
        onClear={() => deleteFullTextSearchWithIndex(0)}
      />
      <Modal
        openRef={modalRef}
        title={t`Full-text search`}
        onSubmit={() => {
          setFullTextSearchWithIndex(value, 0)
          modalRef.current?.(false)
        }}
        actions={
          <>
            <Button color="primary" onClick={() => modalRef.current?.(false)}>
              <Trans>Close</Trans>
            </Button>
            <Button type="submit" color="primary">
              <Trans>Submit</Trans>
            </Button>
          </>
        }
      >
        <TextField
          autoFocus
          id="full-text-search"
          name="full-text-search"
          autoComplete="search"
          label={t`Full-text search`}
          variant="outlined"
          fullWidth
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value ?? '')}
        />
      </Modal>
    </>
  )
}
