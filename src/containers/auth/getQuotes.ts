import { t } from '@lingui/macro'

export const getQuotes = () =>
  [
    {
      src: 'https://s3-alpha-sig.figma.com/img/e850/601a/b5dd225ab16d552d5b8fc010bda786b7?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QbCNEEvjVVGangveMMS55~aP7gxv1CG4P8zPq0hI2Cmr7Qhif6uvg5vgHtwodcD3myCrbGg42-SXxqFgwhipvhxud24UxahAuu6lY3qYFb6lqJaI0gghzXge3Q~GdACDFJZdymoNktD68DsHaKzC5jjFX6tntdXEr9cdBjIYIP91ycQ0daYw08PPy37BRsMXyEV5bBXpVa1Ci6s2QME6XuIREohR77NvAQWHiBgLGI~GKimusIreYbHdyizgntE6dGwjT-fUBg3~BsKtI3gXQG9N6p3J2EeIq2FXiD0cEmmCDwOkP0MXUNjDFv9p61CAfIG3icHuL-Tl~-c7deqkxQ__',
      name: 'Fernando Carletti',
      position: t`Senior Software Engineer at kavak`,
      text: t`The major ‘click’ for me was when I saw how Fix Security allows you to just search for all relationships for all resources. And that was magical, to be honest.`,
    },
    {
      src: 'https://s3-alpha-sig.figma.com/img/e526/02ef/92875ba35fa1eb00cbef0433b0b3819e?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TIbuF4hHQCjrEnS5bO4cym924str1CUXqVuMNqBxL0o2~GtUOWFRyZxVdy1tyiLwxD09U-yAq9QdaupMyTHZJoIVfR4VwH1BP2fmqEbB-Ied82azdU3mYjF2OUtoTAED4dFBvmzj7mKuWnih0KBq~XRSYSF2Rh3CD-rmxlESEeo5526wRYVRbcNQCUR2kLx6nSbAsHa5nmh2uE7lnOKZJqppThqWTHx9FVGBPK52NlxMIYpmkLIzsNfU88kvlWs6tflOuhTAd~gcwHOzle1BJMmAdXCdWxlvdMvpSSrLN8t0XYs8quZnivug4ArSSi0xC3M7~J7T5fZ2g8vWDdb6MQ__',
      name: 'Nick Mistry',
      position: t`CISO at Lineaje at lineaje`,
      text: t`What I like about Fix Security is that I can actually see the test. When the rubber meets the road, what I want to know is: what’s the call you’re making on the API?`,
    },
    {
      src: 'https://s3-alpha-sig.figma.com/img/b098/e52c/c28f3a4da5c67bc01b72d812ba639a5c?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RFawSlvC9aF2decz~luBGGU1vsHk1pNHjBLpYfmq-XuG0V5AmLz7BPf28r1eS8fbHDclo7bWQttOs6UKn~1xSu8Rn2KcK64Bmtl2U0oKqcCvoRqiVpru5McKTvIex9Cdlw2XvVGXnrzqBdkMOvbYjKNFmYjSd7dRHqKIagQXB5zN7EcE~rNoHl0qoceBiJ7C-lnUWMfTfBquN-UIrNHEQjnRamRJAOiWN0G7kMqTiE0vPKgpUXed0ZHJzCmCMF6vkiBACN78MOTrTQifHK9buLm5fztLVIswmfzDbECqRSSUkPri4dbtAzkKOHlj-uPgxAkmPoyRf~FRbOIkASBsGA__',
      name: 'Rotem Levi',
      position: t`Security Engineer at cloudzone`,
      text: t`I’ve never found use in tools that just give me an asset list. With Fix Security, I get filters and scenarios, like public instances with admin rights or IAM users without MFA.`,
    },
  ] as const

export type QuoteType = ReturnType<typeof getQuotes>[number]
