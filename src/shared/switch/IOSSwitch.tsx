import { styled, Switch, switchClasses, SwitchProps } from '@mui/material'

interface IOSSwitchProps extends SwitchProps {
  width?: number
  height?: number
  thumbWidth?: number
  thumbMargin?: number
}

export const IOSSwitch = styled(({ width: _width, height: _height, thumbWidth: _thumbWidth, ...props }: IOSSwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme: { spacing, palette, transitions }, width = 44, height = 24, thumbWidth = 16 }) => ({
  width,
  height,
  margin: 0,
  marginRight: spacing(2),
  padding: 0,
  [`& .${switchClasses.switchBase}`]: {
    padding: 0,
    margin: (height - thumbWidth) / 2,
    transitionDuration: `${transitions.duration.standard}ms`,
    [`&.${switchClasses.checked}`]: {
      color: palette.common.white,
      transform: `translateX(${width - (height - thumbWidth) / 2})`,
      [`& + .${switchClasses.track}`]: {
        backgroundColor: palette.primary.main,
        opacity: 1,
        border: 0,
      },
      [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
        opacity: 0.5,
      },
    },
    [`&.Mui-focusVisible + .${switchClasses.thumb}`]: {
      color: palette.primary.main,
      boxShadow: '-2px 4px 8px 0px rgba(0, 0, 0, 0.2)',
      border: '6px solid #fff',
    },
    [`&.${switchClasses.disabled} .${switchClasses.thumb}`]: {
      color: palette.divider,
    },
    [`&.${switchClasses.disabled}  + .${switchClasses.track}`]: {
      opacity: 0.7,
    },
  },
  [`& .${switchClasses.thumb}`]: {
    boxSizing: 'border-box',
    backgroundColor: palette.common.white,
    boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.2)',
    transition: transitions.create(['box-shadow'], {
      duration: 500,
    }),
    width: thumbWidth,
    height: thumbWidth,
  },
  [`& .${switchClasses.track}`]: {
    borderRadius: height / 2,
    backgroundColor: palette.divider,
    opacity: 1,
    transition: transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}))
