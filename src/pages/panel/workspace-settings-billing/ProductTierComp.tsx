import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoneIcon from '@mui/icons-material/Done'
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { Fragment } from 'react'
import { GetWorkspaceProductTier } from 'src/shared/types/server'
import { ProductTier } from 'src/shared/types/server-shared'
import { getISO8601DurationFromTimestamp, iso8601DurationToString, parseISO8601Duration } from 'src/shared/utils/parseDuration'
import { productTierToDescription, productTierToLabel } from './utils'

export interface ProductTierCompProps {
  productTier: ProductTier
  productTierData: GetWorkspaceProductTier
}

export const ProductTierComp = ({ productTier, productTierData }: ProductTierCompProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const scanInterval = getISO8601DurationFromTimestamp(parseISO8601Duration(productTierData.scan_interval).duration)
  const historyMax = getISO8601DurationFromTimestamp(parseISO8601Duration(productTierData.retention_period).duration)
  const scanIntervalStr =
    scanInterval.years === 1
      ? t`Yearly`
      : scanInterval.months === 1
        ? t`Monthly`
        : scanInterval.days === 1
          ? t`Daily`
          : scanInterval.hours === 1
            ? t`Hourly`
            : t`${iso8601DurationToString(scanInterval, 2)} per`
  const historyMaxStr = t`${historyMax.years * 12 + historyMax.months}-month history`
  const label = productTierToLabel(productTier)
  const desc = productTierToDescription(productTier)
  if (!desc) {
    return null
  }
  return (
    <Stack spacing={4} width={216} height="100%">
      <Typography component={Stack} direction="row" alignContent="center" variant="h4" color="primary.main">
        <Box mr={1.5} display="inline-block">
          <desc.icon />
        </Box>
        {label}
      </Typography>
      <Typography>
        <Typography fontWeight={500} component="span">
          {desc.description.split('\\n').map((text, i) => (
            <Fragment key={i}>
              {text}
              <br />
            </Fragment>
          ))}
        </Typography>{' '}
      </Typography>
      <Stack direction="column" my={1.5} spacing={0.25} alignItems="baseline">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="h3" fontWeight={700} lineHeight="1.5rem" letterSpacing="-.025em" fontSize="1.875rem !important">
            ${((productTierData.price_per_account_cents / 100) * productTierData.accounts_included).toLocaleString(locale)}
          </Typography>
          {desc.monthly ? (
            <Typography variant="h6" fontWeight={600} lineHeight="1.5rem" fontSize="1.125rem !important" marginTop=".125rem !important">
              <Trans>/ month</Trans>
            </Typography>
          ) : null}
        </Stack>
        {productTierData.account_limit !== null ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`maximum of ${productTierData.account_limit} cloud accounts`}
          </Typography>
        ) : productTierData.accounts_included ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`${productTierData.accounts_included} cloud accounts included`}
          </Typography>
        ) : (
          <Box height="1.5rem" />
        )}
        {productTierData.price_per_account_cents ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`($${(productTierData.price_per_account_cents / 100).toLocaleString(locale)} / month per additional account)`}
          </Typography>
        ) : (
          <Box height="calc(1.5rem + 2px)" />
        )}
      </Stack>
      <Divider />
      <Stack mt={1.5} spacing={0.75}>
        <Typography>
          <Trans>{scanIntervalStr} scans</Trans>
        </Typography>
        <Typography>
          {productTierData.seats_included > 1 ? (
            <Trans>
              {productTierData.seats_included} seats included {productTierData.seats_max ? t`(${productTierData.seats_max} max)` : ''}
            </Trans>
          ) : productTierData.seats_max ? (
            <Trans>{productTierData.seats_max} seat max</Trans>
          ) : null}
        </Typography>
      </Stack>
      <Stack spacing={0.75}>
        <Typography fontWeight={600}>{desc.featuresTitle}:</Typography>
        <List dense>
          <ListItem sx={{ p: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">{historyMaxStr}</Typography>
            </ListItemText>
          </ListItem>
          {desc.features.map((feature, i) => (
            <ListItem key={i} sx={{ p: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">{feature}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack justifyContent="end" flexGrow={1}>
        <Stack height={210} spacing={0.75}>
          <Typography fontWeight={600}>Support:</Typography>
          <List dense>
            {desc.support.map((support, i) => (
              <ListItem key={i} sx={{ p: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">{support}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Stack>
  )
}
