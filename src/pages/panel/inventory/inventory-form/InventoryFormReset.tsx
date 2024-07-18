import { t } from '@lingui/macro'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, Stack, Tooltip, alpha } from '@mui/material'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { allHistoryChangesOptions } from './utils/allHistoryChangesOptions'

export const InventoryFormReset = () => {
  const { q, history, onHistoryChange, reset } = useFixQueryParser()
  return q || (history.changes.length && history.changes.length !== allHistoryChangesOptions.length) ? (
    <Stack order={1} alignSelf="stretch" alignItems="end" flexGrow={1}>
      <Tooltip title={t`Clear the search`} arrow>
        <IconButton
          onClick={() => {
            onHistoryChange({ changes: [...allHistoryChangesOptions] })
            reset()
          }}
          color="info"
          sx={{ boxShadow: 0, borderColor: ({ palette }) => alpha(palette.info.main, 0.5), borderStyle: 'solid', borderWidth: 1 }}
        >
          <HighlightOffIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  ) : null
}
