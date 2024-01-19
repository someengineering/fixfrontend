import { StoryContext } from '@storybook/react'
import { FC } from 'react'
import { BasicProviders } from 'src/shared/providers'
import { InnerBasicProviders } from './InnerBasicProviders'

export const WithProviders = ({ Story, context }: { Story: FC; context: StoryContext }) => {
  return (
    <BasicProviders>
      <InnerBasicProviders Story={Story} context={context} />
    </BasicProviders>
  )
}
