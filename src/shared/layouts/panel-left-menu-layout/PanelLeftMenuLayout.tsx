import { Box, Button, Divider, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { FC, Key, PropsWithChildren, ReactNode } from 'react'
import { SvgIconProps } from 'src/assets/icons'
import { HelpSlider, HelpSliderProps } from 'src/shared/right-slider'

interface MenuItem {
  label: string
  Icon: FC<SvgIconProps>
  id?: Key
  onClick?: () => void
  count?: number
  selected?: boolean
}

interface PanelLeftMenuLayoutProps extends PropsWithChildren {
  helpSliderProps?: HelpSliderProps
  title?: ReactNode
  menuList: MenuItem[]
}

export const PanelLeftMenuLayout = ({ menuList, helpSliderProps, title, children }: PanelLeftMenuLayoutProps) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  return (
    <Stack
      direction="row"
      m={-3}
      height={({ spacing }) => `calc(100% + ${spacing(6)})`}
      width={({ spacing }) => `calc(100% + ${spacing(6)})`}
      flex={1}
      overflow="auto"
    >
      <Stack flex={0} height="100%">
        <Box py={3} px={3.5}>
          {helpSliderProps ? (
            <HelpSlider
              {...helpSliderProps}
              slotProps={
                isDesktop
                  ? helpSliderProps.slotProps
                  : {
                      ...helpSliderProps.slotProps,
                      iconButtonProps: {
                        ...helpSliderProps.slotProps?.iconButtonProps,
                        sx: { ...helpSliderProps.slotProps?.iconButtonProps?.sx, p: 0 },
                      },
                    }
              }
            >
              {isDesktop ? title : null}
            </HelpSlider>
          ) : (
            title
          )}
        </Box>
        <Divider />
        <Stack p={{ xs: 2, lg: 2.5 }} spacing={0.5} overflow="auto">
          {menuList.map(({ Icon, id, label, count, onClick, selected }, index) => {
            const buttonContent = (
              <Stack direction={isDesktop ? 'row' : 'column'} spacing={1} width="100%" alignItems="center">
                <Icon color={selected ? 'primary.main' : undefined} />
                {isDesktop ? (
                  <Typography
                    variant="subtitle2"
                    fontWeight={selected ? 500 : 400}
                    px={selected ? 0 : 0.125}
                    color={selected ? 'primary.main' : undefined}
                    flex={1}
                    whiteSpace="nowrap"
                    height="auto"
                    textAlign="left"
                  >
                    {label}
                  </Typography>
                ) : null}
                {count ? (
                  <Typography variant="subtitle2" fontWeight={selected ? 500 : 400} color={selected ? 'primary.main' : undefined}>
                    {count}
                  </Typography>
                ) : null}
              </Stack>
            )
            return (
              <Button
                onClick={onClick}
                key={`${id ?? index}_${selected ?? false}`}
                sx={{
                  bgcolor: selected ? 'background.default' : undefined,
                  minWidth: 0,
                  borderRadius: '6px',
                  py: 1,
                  px: 1.5,
                  color: 'text.primary',
                }}
              >
                {isDesktop ? (
                  buttonContent
                ) : (
                  <Tooltip title={label} placement="right" arrow>
                    {buttonContent}
                  </Tooltip>
                )}
              </Button>
            )
          })}
        </Stack>
      </Stack>
      <Divider orientation="vertical" />
      {children}
    </Stack>
  )
}
