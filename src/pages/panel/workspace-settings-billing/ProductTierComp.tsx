import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoneIcon from '@mui/icons-material/Done'
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { ProductTier } from 'src/shared/types/server'
import { productTierToDescription, productTierToLabel } from './utils'

export interface ProductTierCompProps {
  productTier: ProductTier
}

export const ProductTierComp = ({ productTier }: ProductTierCompProps) => {
  const {
    i18n: { locale },
  } = useLingui()
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
          {desc.description}
        </Typography>{' '}
      </Typography>
      <Stack direction="column" my={1.5} spacing={0.25} alignItems="baseline">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="h3" fontWeight={700} lineHeight="1.5rem" letterSpacing="-.025em" fontSize="1.875rem !important">
            {desc.price.toLocaleString(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </Typography>
          {desc.monthly ? (
            <Typography variant="h6" fontWeight={600} lineHeight="1.5rem" fontSize="1.125rem !important" marginTop=".125rem !important">
              <Trans>/ month</Trans>
            </Typography>
          ) : null}
        </Stack>
        {desc.cloudAccounts.maximum ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`maximum of ${desc.cloudAccounts.maximum} cloud accounts`}
          </Typography>
        ) : desc.cloudAccounts.included ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`${desc.cloudAccounts.included} cloud accounts included`}
          </Typography>
        ) : (
          <Box height="1.5rem" />
        )}
        {desc.cloudAccounts.additionalCost ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`(${desc.cloudAccounts.additionalCost.toLocaleString(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} / month per additional account)`}
          </Typography>
        ) : (
          <Box height="3rem" />
        )}
      </Stack>
      <Divider />
      <Stack mt={1.5} spacing={0.75}>
        <Typography>
          <Trans>{desc.scanFrequency} scans</Trans>
        </Typography>
        <Typography>
          {desc.seats.included ? (
            <Trans>
              {desc.seats.included} seats included {desc.seats.maximum ? t`(${desc.seats.maximum} max)` : ''}
            </Trans>
          ) : (
            <Trans>{desc.seats.maximum} seat max</Trans>
          )}
        </Typography>
      </Stack>
      <Stack spacing={0.75}>
        <Typography fontWeight={600}>{desc.featuresTitle}:</Typography>
        <List dense>
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
        <Stack height={155} spacing={0.75}>
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
