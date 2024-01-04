import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import LanguageIcon from '@mui/icons-material/Language'
import { Box, IconButton, IconButtonProps, Menu, MenuItem, MenuProps, Tooltip, Typography, styled } from '@mui/material'
import { MouseEvent as MouseEventReact, useState } from 'react'
import { langs } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

interface LanguageButtonProps {
  iconButtonProps?: IconButtonProps
  whiteMode?: boolean
  menuProps?: Omit<MenuProps, 'open' | 'id' | 'anchorEl' | 'onClose'>
}

const LanguageIconButton = styled(IconButton, { shouldForwardProp: shouldForwardPropWithBlackList(['whiteMode']) })<{ whiteMode: boolean }>(
  ({ theme, whiteMode }) => ({
    padding: 0,
    marginRight: theme.spacing(2),
    color: whiteMode && theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.primary.main,
  }),
)

export const LanguageButton = ({ iconButtonProps, whiteMode, menuProps }: LanguageButtonProps) => {
  const { i18n } = useLingui()
  const [anchorElLanguage, setAnchorElLanguage] = useState<HTMLElement>()
  const handleOpenUserMenu = (event: MouseEventReact<HTMLElement, MouseEvent>) => {
    setAnchorElLanguage(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElLanguage(undefined)
  }

  const handleSelectLanguage = (locale: string) => {
    handleCloseUserMenu()
    i18n.activate(locale)
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt="0 !important">
      <Tooltip title={t`Select Language`}>
        <LanguageIconButton whiteMode={whiteMode ?? false} size="large" {...(iconButtonProps ?? {})} onClick={handleOpenUserMenu}>
          <LanguageIcon fontSize="large" />
        </LanguageIconButton>
      </Tooltip>
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...menuProps}
        sx={{ mt: '45px', ...(menuProps?.sx ?? {}) }}
        id="language-menu"
        anchorEl={anchorElLanguage}
        open={Boolean(anchorElLanguage)}
        onClose={handleCloseUserMenu}
      >
        {Object.entries(langs).map(([locale, { IconWide, title }]) => (
          <MenuItem
            key={locale}
            onClick={locale === i18n.locale ? undefined : () => handleSelectLanguage(locale)}
            disabled={locale === i18n.locale}
          >
            <IconWide width={32} />
            <Typography ml={1}>{title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
