import { t } from '@lingui/macro'

export const getQuotes = () =>
  [
    {
      src: 'https://cdn.some.engineering/fix/assets/ui/qoutes/Fernando%20Carletti.png',
      name: 'Fernando Carletti',
      position: t`Senior Software Engineer at kavak`,
      text: t`The major ‘click’ for me was when I saw how Fix Security allows you to just search for all relationships for all resources. And that was magical, to be honest.`,
    },
    {
      src: 'https://cdn.some.engineering/fix/assets/ui/qoutes/Nick%20Mistry.png',
      name: 'Nick Mistry',
      position: t`CISO at Lineaje at lineaje`,
      text: t`What I like about Fix Security is that I can actually see the test. When the rubber meets the road, what I want to know is: what’s the call you’re making on the API?`,
    },
    {
      src: 'https://cdn.some.engineering/fix/assets/ui/qoutes/Rotem%20Levi.png',
      name: 'Rotem Levi',
      position: t`Security Engineer at cloudzone`,
      text: t`I’ve never found use in tools that just give me an asset list. With Fix Security, I get filters and scenarios, like public instances with admin rights or IAM users without MFA.`,
    },
  ] as const

export type QuoteType = ReturnType<typeof getQuotes>[number]
