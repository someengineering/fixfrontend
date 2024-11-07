import { t } from '@lingui/macro'
import { IconButton, Stack, Tooltip, alpha } from '@mui/material'
import { CancelIcon } from 'src/assets/icons'
import { useFixQueryParser } from 'src/shared/fix-query-parser'

export const InventoryFormReset = () => {
  const { q, history, reset } = useFixQueryParser()
  return q || (history.changes.length && history.changes.length) ? (
    <Stack order={1} alignSelf="stretch" alignItems="end" flexGrow={1}>
      <Tooltip title={t`Clear the search`} arrow>
        <IconButton
          onClick={reset}
          color="info"
          sx={{ boxShadow: 0, borderColor: ({ palette }) => alpha(palette.info.main, 0.5), borderStyle: 'solid', borderWidth: 1 }}
        >
          <CancelIcon width={20} height={20} />
        </IconButton>
      </Tooltip>
    </Stack>
  ) : null
}
