import { AutocompleteRenderOptionState, ListItemButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { HTMLAttributes, ReactElement, ReactNode, forwardRef } from 'react'
import { ListChildComponentProps, VariableSizeList } from 'react-window'
import { OuterElementContext } from './helper/OuterElementContext'
import { OuterElementType } from './helper/OuterElementType'
import { useResetCache } from './helper/useResetCache'

const LIST_BOX_PADDING = 16

type DataItemType = [HTMLAttributes<HTMLLIElement>, ReactNode, AutocompleteRenderOptionState]

function RenderRow({
  data,
  index,
  style: { background: _background, backgroundColor: _backgroundColor, ...style },
}: ListChildComponentProps) {
  const [props, option, { inputValue: _state, ...state }] = (data as DataItemType[])[index]

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LIST_BOX_PADDING,
  }

  return (
    <Tooltip title={option} arrow enterDelay={400} enterNextDelay={400}>
      <ListItemButton component="li" {...props} {...state} style={inlineStyle}>
        <Typography noWrap>{option}</Typography>
      </ListItemButton>
    </Tooltip>
  )
}

export const ListboxComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>(function ListboxComponent(
  { children, ...other },
  ref,
) {
  const itemData: ReactElement[] = []

  if (Array.isArray(children)) {
    children.forEach((item: ReactElement & { children?: ReactElement[] }) => {
      itemData.push(item)
      itemData.push(...(item.children || []))
    })
  }

  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child: ReactElement) => {
    if ('group' in child) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LIST_BOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {RenderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})
