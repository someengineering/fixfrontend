import { Skeleton } from '@mui/material'
import { SetupTemplateButtonComponent } from './SetupTemplateButtonComponent'

export const SetupTemplateButtonSkeleton = () => {
  return (
    <Skeleton>
      <SetupTemplateButtonComponent url="https://*********.**.*********.***/***/***-****-***-**.yaml" />
    </Skeleton>
  )
}
