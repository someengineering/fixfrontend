/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Trans } from '@lingui/macro'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, Drawer, Link, Stack, Typography, drawerClasses } from '@mui/material'
import Cookies from 'js-cookie'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useRef, useState } from 'react'
import { env } from 'src/shared/constants'

const CookieConsentComp = () => {
  const posthog = usePostHog()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showConsent, setShowConsent] = useState(posthog.has_opted_in_capturing() ? false : Cookies.get('cookie_consent') !== 'false')

  useEffect(() => {
    if (posthog.has_opted_in_capturing() || Cookies.get('cookie_consent') !== 'false') {
      Cookies.remove('cookie_consent', {
        domain: env.isProd ? '.fix.security' : undefined,
        secure: !env.isLocal,
      })
    }
  }, [posthog])

  return (
    <Drawer
      open={showConsent}
      anchor="bottom"
      ref={containerRef}
      sx={{ [`& .${drawerClasses.paper}`]: { maxWidth: 550, margin: '0 auto' } }}
    >
      <Box p={3}>
        <Typography paragraph textAlign="justify">
          <Trans>
            We use cookies and other tracking technologies to analyze site usage and assist in marketing efforts. For details, see our{' '}
            <Link
              target="_blank"
              href="https://fix.security/cookie-policy"
              alignContent="center"
              alignItems="center"
              display="inline-flex"
              whiteSpace="nowrap"
            >
              cookie policy
              <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
            </Link>
            .
          </Trans>
        </Typography>
        <Stack spacing={1} justifyContent="space-between" direction="row">
          <Button
            variant="text"
            className="ph-no-capture"
            onClick={() => {
              setShowConsent(false)
              Cookies.set('cookie_consent', 'false', {
                domain: env.isProd ? '.fix.security' : undefined,
                expires: 365,
                secure: !env.isLocal,
              })
              posthog.opt_out_capturing()
            }}
          >
            <Trans>Reject</Trans>
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowConsent(false)
              posthog.opt_in_capturing({ enable_persistence: true, persistence_type: 'localStorage+cookie', cross_subdomain_cookie: true })
            }}
          >
            <Trans>Accept</Trans>
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}

export const CookieConsent = () => (!env.isLocal && !env.isTest ? <CookieConsentComp /> : null)
