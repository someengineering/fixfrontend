import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import { ButtonTypeMap } from '@mui/material'
import { ElementType, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export function LinkButton<RootComponent extends ElementType = ButtonTypeMap['defaultComponent'], AdditionalProps = {}>(
  props: LoadingButtonProps<RootComponent, AdditionalProps>,
) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingButton
      loading={loading}
      loadingPosition="end"
      endIcon={<OpenInNewIcon fontSize="small" />}
      {...props}
      onClick={(e) => {
        setLoading(true)
        if ('onClick' in props && typeof props.onClick === 'function') {
          props.onClick(e)
        }
      }}
    />
  )
}
