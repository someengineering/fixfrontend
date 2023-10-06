import { Button, Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getOrganizationCfTemplateQuery } from '../shared-queries/getOrganizationCfTemplate.query'

export const SetupTemplateButtonComponent = ({ url, isSkleton }: { url?: string; isSkleton?: boolean }) => {
  return (
    <Button href={(!isSkleton && url) || '#'} target={isSkleton ? undefined : '_blank'} variant="text" sx={{ maxWidth: '100%', px: 0 }}>
      <Typography variant="subtitle2" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
        {url}
      </Typography>
    </Button>
  )
}

export const SetupTemplateButtonSkeleton = () => {
  return (
    <Skeleton>
      <SetupTemplateButtonComponent url="https://*********.**.*********.***/***/***-****-***-**.yaml" isSkleton />
    </Skeleton>
  )
}

export const SetupTemplateButton = () => {
  const { selectedOrganization } = useUserProfile()
  const { data: cfTemplateUrl } = useQuery(['organization-cf-template', selectedOrganization?.id], getOrganizationCfTemplateQuery, {
    enabled: !!selectedOrganization?.id,
  })
  return <SetupTemplateButtonComponent url={cfTemplateUrl} />
}
