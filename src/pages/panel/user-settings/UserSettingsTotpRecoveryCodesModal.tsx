import { Trans } from '@lingui/macro'
import { Button, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'
import { MutableRefObject, useRef } from 'react'
import { Modal } from 'src/shared/modal'
import { useCopyString } from 'src/shared/utils/useCopyString'

interface UserSettingsTotpRecoveryCodesModalProps {
  recoveryCodesModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  recoveryCodes: string[]
  onClose?: () => void
}

export const UserSettingsTotpRecoveryCodesModal = ({
  recoveryCodesModalRef,
  recoveryCodes,
  onClose,
}: UserSettingsTotpRecoveryCodesModalProps) => {
  const tableRef = useRef<HTMLTableElement>(null)
  const copy = useCopyString(true)
  return (
    <Modal
      onClose={onClose}
      openRef={recoveryCodesModalRef}
      title={<Trans>Recovery codes</Trans>}
      description={<Trans>Print or copy the following recovery codes</Trans>}
      actions={
        <>
          <Stack width="100%" alignItems="start">
            <Button
              variant="outlined"
              onClick={() => {
                recoveryCodesModalRef.current?.(false)
                onClose?.()
              }}
            >
              <Trans>Close</Trans>
            </Button>
          </Stack>
          <Button variant="contained" color="primary" onClick={() => void copy(recoveryCodes.join('\n'))}>
            Copy
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              const newWin = window.open('')
              newWin?.document.write(tableRef.current?.outerHTML ?? '')
              newWin?.print()
              newWin?.close()
            }}
          >
            Print
          </Button>
        </>
      }
    >
      <Table ref={tableRef}>
        <TableBody>
          {recoveryCodes.map((recoveryCode) => (
            <TableRow>
              <TableCell>{recoveryCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Modal>
  )
}
