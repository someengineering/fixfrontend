import { StoryContext, StrictArgs } from '@storybook/react'
import { FC } from 'react'
import { BasicProviders } from 'src/shared/providers'
import { InnerBasicProviders } from './InnerBasicProviders'

export const WithProviders = ({ Story, context }: { Story: FC<StrictArgs>; context: StoryContext }) => (
  <BasicProviders>
    <InnerBasicProviders Story={Story} context={context} />
  </BasicProviders>
)
