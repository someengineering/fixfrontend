import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { To } from 'react-router-dom'
import { AwsLogo, AzureLogoWithText, GCPLogoWithText, SvgIconProps } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { InternalLinkButton } from 'src/shared/link-button'

interface SetupCloudPageItemProps<IconProps extends SvgIconProps> {
  Icon: FC<IconProps>
  iconProps: IconProps
  to: string & To
}

function SetupCloudPageItem<IconProps extends SvgIconProps>({ Icon, iconProps, to }: SetupCloudPageItemProps<IconProps>) {
  return (
    <InternalLinkButton
      component={Stack}
      sx={{
        bgcolor: 'common.white',
        border: `1px solid ${panelUI.uiThemePalette.primary.divider}`,
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'left',
        ':hover': {
          bgcolor: 'common.white',
        },
        width: 440,
        py: 2.75,
        px: 3,
        borderRadius: 3,
        maxWidth: '100%',
      }}
      color="secondary"
      to={to}
      size="small"
      direction="row"
    >
      <Icon {...iconProps} />
      <InternalLinkButton color="secondary" to={to} size="small">
        Select
      </InternalLinkButton>
    </InternalLinkButton>
  )
}

export default function WorkspaceSettingsAccountsSetupCloudPage() {
  return (
    <Stack width="100%" height="100%" alignItems="center" justifyContent="center" spacing={3.125}>
      <Typography variant="h4">Select your cloud account</Typography>
      <Stack spacing={2}>
        <SetupCloudPageItem Icon={AwsLogo} iconProps={{ width: 53.55, height: 32 }} to="/accounts/setup-cloud/aws" />
        <SetupCloudPageItem Icon={GCPLogoWithText} iconProps={{ width: 153.21, height: 24 }} to="/accounts/setup-cloud/gcp" />
        <SetupCloudPageItem Icon={AzureLogoWithText} iconProps={{ width: 107, height: 30 }} to="/accounts/setup-cloud/azure" />
      </Stack>
    </Stack>
  )
}
