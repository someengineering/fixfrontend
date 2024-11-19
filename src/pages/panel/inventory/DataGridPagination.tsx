import { Trans } from '@lingui/macro'
import { Button, Pagination, PaginationItem, Stack, Typography } from '@mui/material'
import {
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-premium'
import { ArrowBackIcon, ArrowForwardIcon } from 'src/assets/icons'

export const DataGridPagination = () => {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const size = useGridSelector(apiRef, gridPageSizeSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)
  const total = useGridSelector(apiRef, gridRowCountSelector)

  return (
    <Stack direction="row" spacing={3} alignItems="center" flexWrap="nowrap" overflow="auto" maxWidth="100%">
      <Typography variant="subtitle1" fontWeight={500} whiteSpace="nowrap">
        {page * size}-{(page + 1) * size > total ? total : (page + 1) * size}{' '}
        <Typography component="span" variant="subtitle1" fontWeight={400} color="textSecondary">
          <Trans>of {total} results</Trans>
        </Typography>
      </Typography>
      {pageCount < 2 ? null : (
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          page={page + 1}
          sx={{ ul: { flexWrap: 'nowrap' } }}
          count={pageCount}
          renderItem={(props2) => {
            return ['start-ellipsis', 'end-ellipsis', 'page'].includes(props2.type) ? (
              <PaginationItem
                {...props2}
                sx={{
                  borderRadius: '50%',
                  borderColor: 'transparent',
                  color: 'primary.main',
                  [`&.Mui-selected`]: {
                    bgcolor: 'primary.main',
                    color: 'common.white',
                  },
                }}
              />
            ) : ['next', 'previous'].includes(props2.type) ? (
              <Button
                sx={{
                  ml: props2.type === 'next' ? 3 : 0,
                  mr: props2.type === 'next' ? 0 : 3,
                }}
                variant={props2.type === 'next' ? 'contained' : 'outlined'}
                startIcon={props2.type === 'next' ? null : <ArrowBackIcon />}
                endIcon={props2.type === 'next' ? <ArrowForwardIcon /> : null}
                onClick={props2.onClick}
                disabled={props2.disabled}
              >
                {props2.type === 'next' ? <Trans>Next</Trans> : <Trans>Previous</Trans>}
              </Button>
            ) : null
          }}
          onChange={(_: unknown, value: number) => apiRef.current.setPage(value - 1)}
        />
      )}
    </Stack>
  )
}
