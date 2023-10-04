import { Trans } from '@lingui/macro'
import { Box, Button, Divider, List, ListItem, Skeleton, Typography } from '@mui/material'
import { loremIpsum } from 'lorem-ipsum'
import { Suspense, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { ExternalId } from './ExternalId'
import { SetupCloudButton } from './SetupCloudButton'

interface PanelSetupCloudProps {
  onModalClose: () => void
}

export default function PanelSetupCloud({ onModalClose }: PanelSetupCloudProps) {
  const { instructions, mainPragraph } = useMemo(
    () => ({
      mainPragraph: loremIpsum({ count: 10 }),
      instructions: Array.from(Array(5)).map(() => loremIpsum({ count: 2 })),
    }),
    [],
  )
  return (
    <>
      <Typography variant="h1" color="secondary" mb={2}>
        <Trans>Setup cloud</Trans>
      </Typography>
      <Typography variant="body1" textAlign="justify">
        {mainPragraph}
      </Typography>
      <Box display="flex" py={2} alignItems="center">
        <Typography variant="h5">
          <Trans>External Id:</Trans>
        </Typography>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={
              <Box ml={2}>
                <Skeleton variant="rectangular" width={376} height={52} />
              </Box>
            }
          >
            <ExternalId />
          </Suspense>
        </ErrorBoundary>
      </Box>
      <List>
        {instructions.map((text, i) => (
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0, ml: 2 }} key={i}>
            <Typography variant="body2" textAlign="justify">
              {text}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Box pb={3}>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={
              <Skeleton variant="rounded">
                <Button>
                  <Trans>Go To Setup</Trans>
                </Button>
              </Skeleton>
            }
          >
            <SetupCloudButton />
          </Suspense>
        </ErrorBoundary>
      </Box>
      <Divider />
      <Box pt={3} display="flex" justifyContent="end">
        <Button onClick={onModalClose} variant="outlined">
          Skip
        </Button>
      </Box>
    </>
  )
}
