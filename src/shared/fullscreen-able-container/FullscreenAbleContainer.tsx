import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { Box, Fab } from '@mui/material'
import { forwardRef, useEffect, useRef } from 'react'
import { useFullscreen } from 'src/shared/utils/useFullscreen'

interface FullscreenAbleContainerProps {
  onChange?: (fullscreen: boolean, container: HTMLDivElement) => void
  initialFullscreen?: boolean
}

export const FullscreenAbleContainer = forwardRef<HTMLDivElement, FullscreenAbleContainerProps>(({ onChange, initialFullscreen }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hasFullscreen, fullscreenHandler] = useFullscreen(containerRef, initialFullscreen)

  useEffect(() => {
    if (containerRef.current && onChange) {
      onChange(hasFullscreen, containerRef.current)
    }
  }, [hasFullscreen, onChange])

  return (
    <Box
      width="100%"
      height="100%"
      ref={(e: HTMLDivElement) => {
        containerRef.current = e
        if (typeof ref === 'function') {
          ref(e)
        } else if (ref) {
          ref.current = e
        }
      }}
      position="relative"
    >
      <Fab
        onClick={(e) => void fullscreenHandler(e)}
        sx={({ spacing }) => ({ bottom: spacing(2), right: spacing(2), position: 'absolute' })}
      >
        {hasFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Fab>
    </Box>
  )
})
