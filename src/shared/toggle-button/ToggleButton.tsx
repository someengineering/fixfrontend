import { Stack, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'
import { CloseSmallIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'

interface ToggleButtonProps extends PropsWithChildren {
  value?: boolean
  onChange: (value: boolean) => void
}

export const ToggleButton = ({ onChange, children, value }: ToggleButtonProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      px={1.5}
      py={1}
      bgcolor={value ? 'background.default' : 'common.white'}
      border={({ palette }) => `1px solid ${value ? panelUI.uiThemePalette.text.sub : palette.divider}`}
      color={value ? 'primary.main' : undefined}
      sx={{
        cursor: 'pointer',
        ':hover': {
          borderColor: ({ palette }) => (value ? panelUI.uiThemePalette.text.sub : palette.info.main),
          boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.08)',
        },
      }}
      borderRadius="6px"
      onClick={() => onChange(!value)}
      spacing={1}
      height="40px"
    >
      <Typography fontWeight={value ? 700 : undefined} color={value ? 'primary' : undefined} variant="subtitle1">
        {children}
      </Typography>
      {value ? <CloseSmallIcon /> : undefined}
    </Stack>
  )
}
