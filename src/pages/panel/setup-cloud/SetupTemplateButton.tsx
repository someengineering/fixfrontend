import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCfTemplateQuery } from 'src/pages/panel/shared-queries'
import { SetupTemplateButtonComponent } from './SetupTemplateButtonComponent'

export const SetupTemplateButton = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data: cfTemplateUrl } = useQuery({
    queryKey: ['workspace-cf-template', selectedWorkspace?.id],
    queryFn: getWorkspaceCfTemplateQuery,
    enabled: !!selectedWorkspace?.id,
  })
  return <SetupTemplateButtonComponent url={cfTemplateUrl} />
}
