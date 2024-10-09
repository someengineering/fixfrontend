import { t, Trans } from '@lingui/macro'
import { Box, Button, ButtonBase, Checkbox, Link, Popover, Stack, styled, TextField, Typography } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { KeyboardArrowDownIcon, SearchIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

interface GridFilterItemProps {
  values: string[]
  name: string
  onChange: (values: string[]) => void
  items: { value: string; title: string; Icon?: ReactNode }[]
}

const KeyboardArrowIcon = styled(KeyboardArrowDownIcon, { shouldForwardProp: shouldForwardPropWithBlackList(['upsideDown']) })<{
  upsideDown?: boolean
}>(({ upsideDown }) =>
  upsideDown
    ? {
        transform: 'rotate(180deg)',
      }
    : undefined,
)

const GridFilterItemItem = ({
  onClick,
  value,
  title,
  selected,
  Icon,
}: {
  value: string
  selected: boolean
  title: string
  Icon?: ReactNode
  onClick?: () => void
}) => (
  <Stack key={value} component={ButtonBase} direction="row" pr={1.5} alignItems="center" onClick={onClick}>
    <Checkbox checked={selected} />
    <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center" flex={1}>
      <Box flexShrink={0} flexGrow={1}>
        <Typography variant="subtitle1" textAlign="left">
          {title}
        </Typography>
      </Box>
      <Box flexShrink={1} flexGrow={0}>
        {Icon}
      </Box>
    </Stack>
  </Stack>
)

export const GridFilterItem = ({ name, items, onChange, values: orgValues }: GridFilterItemProps) => {
  const [values, setValues] = useState<string[]>(orgValues)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<HTMLButtonElement | null>(null)
  useEffect(() => {
    setValues(orgValues)
  }, [orgValues])
  const handleClose = () => {
    setValues(orgValues)
    setSearch('')
    setOpen(null)
  }
  const lowerCaseSearch = search.toLowerCase()
  return (
    <>
      <Stack
        component={ButtonBase}
        disableRipple
        width={220}
        maxWidth="100%"
        direction="row"
        py={1}
        px={1.5}
        spacing={1}
        borderRadius="6px"
        alignItems="center"
        justifyContent="space-between"
        border={({ palette }) => `1px solid ${palette.divider}`}
        onClick={(e) => setOpen(e.currentTarget)}
      >
        <Typography variant="subtitle1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {values.length ? (
            values.map((value) => items.find((item) => item.value === value)?.title ?? value).join(', ')
          ) : (
            <Trans>All {name}</Trans>
          )}
        </Typography>
        <Box flex={0}>
          <KeyboardArrowIcon upsideDown={!!open} />
        </Box>
      </Stack>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        elevation={0}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'common.white',
              mt: 1,
              boxShadow: '0px 6px 8px 0px #00000014',
              border: ({ palette }) => `1px solid ${palette.divider}`,
              borderRadius: '12px',
            },
          },
        }}
      >
        <Stack maxWidth="100%" minWidth={332} maxHeight={472} p={2} spacing={1.5}>
          <TextField
            id={`grid-filter-item-search-${name}`}
            name={`grid-filter-item-search-${name}`}
            autoComplete={`grid-filter-item-search-${name}`}
            placeholder={t`Search ${name}`}
            slotProps={{
              htmlInput: {
                list: `grid-filter-item-search-${name}-datalist`,
              },
              input: {
                startAdornment: (
                  <SearchIcon width={24} height={24} color={search ? `${panelUI.uiThemePalette.text.darkGray} !important` : undefined} />
                ),
              },
            }}
            variant="outlined"
            fullWidth
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value ?? '')}
          />
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="buttonSmall" color="textSecondary" fontWeight={500}>
              <Trans>Filter by</Trans>:
            </Typography>
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                onChange([])
                setSearch('')
              }}
            >
              <Typography variant="buttonSmall" color="textSecondary" fontWeight={500}>
                <Trans>Clear all</Trans>
              </Typography>
            </Link>
          </Stack>
          <Stack overflow="auto">
            {search ? null : <GridFilterItemItem title={`All ${name}`} value="" selected={!values.length} onClick={() => setValues([])} />}
            {(search
              ? items.filter(
                  ({ title, value }) => title.toLowerCase().includes(lowerCaseSearch) || value.toLowerCase().includes(lowerCaseSearch),
                )
              : items
            ).map(({ title, value, Icon }) => (
              <GridFilterItemItem
                key={value}
                title={title}
                value={value}
                onClick={() =>
                  setValues((prev) => {
                    const result = [...prev]
                    const indexToRemove = result.findIndex((item) => item === value)
                    if (indexToRemove < 0) {
                      result.push(value)
                    } else {
                      result.splice(indexToRemove, 1)
                    }
                    return result
                  })
                }
                selected={values.includes(value)}
                Icon={Icon}
              />
            ))}
          </Stack>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              onChange(values)
              setSearch('')
              setOpen(null)
            }}
          >
            <Trans>Apply filters</Trans>
          </Button>
        </Stack>
        <datalist id={`grid-filter-item-search-${name}-datalist`}>
          {items.map(({ title, value }) => (
            <option value={title} key={value} />
          ))}
        </datalist>
      </Popover>
    </>
  )
}
