import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCfTemplateQuery } from 'src/pages/panel/shared/queries'
import { useCopyString } from 'src/shared/utils/useCopyString'
import { SetupTemplateButtonComponent } from './SetupTemplateButtonComponent'

export const SetupTemplateButton = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data: cfTemplateUrl } = useSuspenseQuery({
    queryKey: ['workspace-cf-template', selectedWorkspace?.id],
    queryFn: getWorkspaceCfTemplateQuery,
  })
  const copyString = useCopyString()
  const handleCopy = () => {
    if (cfTemplateUrl) {
      copyString(cfTemplateUrl)
    }
  }
  return <SetupTemplateButtonComponent url={cfTemplateUrl} onClick={handleCopy} />
}
