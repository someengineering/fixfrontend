/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Trans } from '@lingui/macro'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, Drawer, Link, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { env } from 'src/shared/constants'

export const CookieConsent = () => {
  const posthog = usePostHog()
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    if (posthog.has_opted_in_capturing()) {
      setShowConsent(false)
    } else {
      setShowConsent(Cookies.get('cookie_consent') !== 'false')
    }

    if (posthog.has_opted_in_capturing() || Cookies.get('cookie_consent') !== 'false') {
      Cookies.remove('cookie_consent', {
        domain: env.isProd ? '.fix.security' : undefined,
        secure: !env.isLocal,
      })
    }
  }, [posthog])

  if (!showConsent) {
    return null
  }

  return (
    <Drawer variant="permanent" anchor="bottom">
      <Box p={3}>
        <Typography paragraph>
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
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault()
              setShowConsent(false)
              posthog.opt_in_capturing({ enable_persistence: true })
            }}
          >
            <Trans>Accept</Trans>
          </Button>
          <Button
            variant="text"
            className="ph-no-capture"
            onClick={(e) => {
              e.preventDefault()
              setShowConsent(false)
              Cookies.set('cookie_consent', 'false', {
                domain: env.isProd ? '.fix.security' : undefined,
                secure: !env.isLocal,
              })
              posthog.opt_out_capturing()
            }}
          >
            <Trans>Reject</Trans>
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
