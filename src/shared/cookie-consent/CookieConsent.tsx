import { Trans } from '@lingui/macro'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Button, Drawer, Link, Stack, Typography, drawerClasses } from '@mui/material'
import Cookies from 'js-cookie'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useRef, useState } from 'react'
import { env } from 'src/shared/constants'
import { PostHogPageView } from 'src/shared/posthog'

const CookieConsentComp = () => {
  const postHog = usePostHog()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showConsent, setShowConsent] = useState(postHog.has_opted_in_capturing() ? false : Cookies.get('cookie_consent') !== 'false')

  useEffect(() => {
    if (postHog.has_opted_in_capturing() || Cookies.get('cookie_consent') !== 'false') {
      Cookies.remove('cookie_consent', {
        domain: env.isProd ? '.fix.security' : undefined,
        secure: !env.isLocal,
      })
    }
  }, [postHog])

  return (
    <Drawer
      open={showConsent}
      anchor="right"
      ref={containerRef}
      hideBackdrop
      disableEnforceFocus
      disableEscapeKeyDown
      disableRestoreFocus
      disableScrollLock
      sx={{
        height: 'auto',
        maxWidth: 576,
        m: 3,
        bottom: 0,
        right: 0,
        left: 'auto',
        top: 'auto',
        [`& .${drawerClasses.paper}`]: { p: 3, position: 'relative', borderRadius: 3 },
      }}
    >
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
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          onClick={() => {
            setShowConsent(false)
            postHog.opt_in_capturing({ enable_persistence: true })
          }}
        >
          <Trans>Accept</Trans>
        </Button>
        <Button
          variant="text"
          className="ph-no-capture"
          onClick={() => {
            setShowConsent(false)
            Cookies.set('cookie_consent', 'false', {
              domain: env.isProd ? '.fix.security' : undefined,
              secure: !env.isLocal,
            })
            postHog.opt_out_capturing()
          }}
        >
          <Trans>Reject</Trans>
        </Button>
      </Stack>
      <PostHogPageView />
    </Drawer>
  )
}

export const CookieConsent = () => ((!env.isTest && !env.isLocal) || env.postHogTest ? <CookieConsentComp /> : null)
