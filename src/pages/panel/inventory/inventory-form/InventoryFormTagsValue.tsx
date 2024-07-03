import { Trans } from '@lingui/macro'
import EditIcon from '@mui/icons-material/Edit'
import { Button, Popover, Skeleton, Stack, backdropClasses } from '@mui/material'
import { useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { Path, Predicate, useFixQueryParser } from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server-shared'
import { InventoryFormFilterRowOpType } from './InventoryFormFilterRowOpType'
import { InventoryFormFilterRowProperty } from './InventoryFormFilterRowProperty'
import { InventoryFormFilterRowValues } from './InventoryFormFilterRowValues'
import { AutoCompletePreDefinedItems } from './utils'

interface InventoryFormTagsValueProps {
  id?: number
  open: HTMLElement | null
  preItems?: AutoCompletePreDefinedItems
  defaultValue?: Predicate
  onChange: (term: Predicate | undefined) => void
  onClose: () => void
}

export const InventoryFormTagsValue = ({ onChange, onClose, open, defaultValue, preItems, id = 0 }: InventoryFormTagsValueProps) => {
  const { is } = useFixQueryParser()
  const [fqn, setFqn] = useState('dictionary[string, string]')
  const [value, setValue] = useState(defaultValue)
  const handleSubmit = (_?: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'escapeKeyDown') {
      onChange(value)
    }
    setFqn('dictionary[string, string]')
    setValue(defaultValue)
    onClose()
  }

  const realFqn = fqn?.split('[')
  const arrayOnly = (realFqn?.length ?? 0) > 1
  const fqnType = realFqn?.[0] as ResourceComplexKindSimpleTypeDefinitions | undefined

  return (
    <Popover
      open={!!open}
      anchorEl={open}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={handleSubmit}
      sx={{
        [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
        maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
      }}
    >
      <Stack pb={2} px={2} spacing={1}>
        <Stack direction="row" flexWrap={{ xs: 'wrap', md: 'nowrap' }} pt={2}>
          <InventoryFormFilterRowProperty
            kinds={preItems?.kinds.map((i) => i.value) ?? []}
            selectedKinds={is?.kinds ?? null}
            defaultForcedValue="tags"
            onChange={({ fqn, op, property, value }) => {
              if (fqn && property) {
                setFqn(fqn)
                setValue(new Predicate({ path: Path.from_string(property), value: value === 'null' ? null : value ?? null, op: op || '=' }))
              } else {
                setFqn('dictionary[string, string]')
                setValue(defaultValue)
              }
            }}
          />
          {value && value.path.toString() ? (
            <>
              <InventoryFormFilterRowOpType
                fqn={fqnType}
                arrayOnly={arrayOnly}
                onChange={(op) =>
                  setValue(
                    (prev) =>
                      new Predicate({
                        path: prev?.path ?? new Path({}),
                        op,
                        value: prev?.value ?? '',
                      }),
                  )
                }
                op={value?.op}
              />
              {fqnType && value && value.path.toString() ? (
                <InventoryFormFilterRowValues
                  fqn={fqnType}
                  keyString={`${fqn}_${id}_${value.path.toString()}`}
                  data={value}
                  onChange={setValue}
                  preItems={preItems}
                />
              ) : (
                <Skeleton>
                  <InventoryFormFilterRowValues
                    fqn="string"
                    keyString={`${fqn}_${id}_${value?.path?.toString()}`}
                    data={value}
                    onChange={() => {}}
                    preItems={preItems}
                  />
                </Skeleton>
              )}
            </>
          ) : null}
        </Stack>
        <Stack alignItems="end">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              onChange(value)
              handleSubmit()
            }}
            startIcon={<EditIcon fontSize="small" />}
          >
            <Trans>Change</Trans>
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}
