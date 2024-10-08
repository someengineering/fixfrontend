import { Trans } from '@lingui/macro'
import { Button, Drawer, Link, Stack, Typography, drawerClasses } from '@mui/material'
import Cookies from 'js-cookie'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useRef, useState } from 'react'
import { OpenInNewIcon } from 'src/assets/icons'
import { env } from 'src/shared/constants'
import { PostHogPageView } from 'src/shared/posthog'
import { useNonce } from 'src/shared/providers'

const CookieConsentComp = () => {
  const postHog = usePostHog()
  const nonce = useNonce()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    if (Cookies.get('cookie_consent') === 'true') {
      postHog.opt_in_capturing()
    } else if (!postHog.has_opted_in_capturing()) {
      setShowConsent(Cookies.get('cookie_consent') !== 'false')
    }

    if (Cookies.get('cookie_consent') !== 'true' && Cookies.get('cookie_consent') !== 'false') {
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
      <Typography component="p" textAlign="justify">
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
            <OpenInNewIcon fontSize="small" style={{ marginLeft: 4 }} nonce={nonce} />
          </Link>
          .
        </Trans>
      </Typography>
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          onClick={() => {
            setShowConsent(false)
            Cookies.set('cookie_consent', 'true', {
              domain: env.isProd ? '.fix.security' : undefined,
              secure: !env.isLocal,
              expires: 365,
            })
            postHog.opt_in_capturing()
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
