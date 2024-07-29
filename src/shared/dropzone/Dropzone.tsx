import { Trans } from '@lingui/macro'
import { Box, Stack, StackProps, Typography, alpha } from '@mui/material'
import { ChangeEvent, DragEvent, MouseEvent as ReactMouseEvent, useCallback, useState } from 'react'

interface DropzoneProps<Multiple extends boolean> extends Omit<StackProps, 'onChange'> {
  isPending?: boolean
  disabled?: boolean
  multiple?: Multiple
  mimeType?: string[]
  onChange: (files?: Multiple extends true ? FileList : File) => void
}

export function Dropzone<Multiple extends boolean = false>({
  mimeType,
  onChange,
  multiple,
  children,
  isPending,
  disabled,
  sx,
  ...otherProps
}: DropzoneProps<Multiple>) {
  const [isDragging, setIsDragging] = useState(false)
  const handleNoOpDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  const handleSetDrag = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = isPending ? 'none' : 'copy'
      setIsDragging(true)
    },
    [isPending],
  )
  const handleClearDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const files = e.dataTransfer?.files ?? undefined
      onChange(
        (multiple ? (files.length ? files : undefined) : (files?.item(0) ?? undefined)) as
          | (Multiple extends true ? FileList : File)
          | undefined,
      )
      setIsDragging(false)
    },
    [multiple, onChange],
  )
  const handleChangeFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ?? undefined
      onChange(
        (multiple ? (files?.length ? files : undefined) : (files?.item(0) ?? undefined)) as
          | (Multiple extends true ? FileList : File)
          | undefined,
      )
    },
    [multiple, onChange],
  )
  const handleClick = useCallback((e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.currentTarget.querySelector('input')?.click()
  }, [])
  return disabled ? (
    <Stack justifyContent="center" alignItems="center" sx={sx} {...otherProps}>
      {children}
    </Stack>
  ) : (
    <Stack
      onDragEnter={handleSetDrag}
      onDragOver={handleSetDrag}
      onDragLeave={handleClearDrag}
      onDrop={isPending ? handleNoOpDrop : handleDrop}
      onClick={isPending ? undefined : handleClick}
      justifyContent="center"
      alignItems="center"
      sx={{
        border: ({ palette }) => `1px ${isDragging || isPending ? 'dashed' : 'solid'} ${palette.primary.main}`,
        bgcolor: isDragging ? ({ palette }) => alpha(palette.primary.main, 0.3) : undefined,
        cursor: isPending ? (isDragging ? 'not-allowed' : 'progress') : 'pointer',
        ...sx,
      }}
      {...otherProps}
    >
      <Box
        component="input"
        type="file"
        sx={{ width: 0, height: 0, opacity: 0, visibility: 'hidden', overflow: 'hidden' }}
        onChangeCapture={handleChangeFile}
        disabled={isPending}
        accept={mimeType?.join(',')}
        multiple={multiple}
      />
      <Box sx={{ pointerEvents: 'none' }}>
        {children ?? (
          <Typography variant="h3" textAlign="center">
            <Trans>Click or Drop your file here</Trans>
          </Typography>
        )}
      </Box>
    </Stack>
  )
}
