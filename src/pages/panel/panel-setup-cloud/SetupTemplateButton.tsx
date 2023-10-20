import { Button, Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCfTemplateQuery } from 'src/pages/panel/shared-queries'

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
  const { selectedWorkspace } = useUserProfile()
  const { data: cfTemplateUrl } = useQuery({
    queryKey: ['workspace-cf-template', selectedWorkspace?.id],
    queryFn: getWorkspaceCfTemplateQuery,
    enabled: !!selectedWorkspace?.id,
  })
  return <SetupTemplateButtonComponent url={cfTemplateUrl} />
}
