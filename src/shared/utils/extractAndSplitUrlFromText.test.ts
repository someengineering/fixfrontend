import { extractAndSplitUrlFromText } from './extractAndSplitUrlFromText'

test('extractAndSplitUrlFromText should get the url and change it to link', () => {
  const withUrl =
    'Cloud Resource Manager API has not been used in project something before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=something then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.'
  const expectWithUrl =
    'Cloud Resource Manager API has not been used in project something before or it is disabled. Enable it by visiting something then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.'
  const withMultipleUrl = `${withUrl} ${withUrl} ${withUrl}`
  const withoutUrl = 'Cloud Resource Manager API has not been used in project something before or it is disabled'

  const resultWithUrl = extractAndSplitUrlFromText(withUrl)
  const resultWithMultipleUrl = extractAndSplitUrlFromText(withMultipleUrl)
  const resultWithoutUrl = extractAndSplitUrlFromText(withoutUrl)

  expect(resultWithUrl.length).toBe(2)
  expect(
    (resultWithUrl as JSX.Element[])
      .map((item) =>
        (item.props as { children: (string | JSX.Element)[] }).children
          .map((i) => (typeof i === 'string' ? i : (i?.props as { href: string })?.href.split('?project=')?.[1]))
          .join(''),
      )
      .join(''),
  ).toBe(expectWithUrl)
  expect(resultWithMultipleUrl.length).toBe(4)
  expect(
    (resultWithMultipleUrl as JSX.Element[])
      .map((item) =>
        (item.props as { children: (string | JSX.Element)[] }).children
          .map((i) => (typeof i === 'string' ? i : (i?.props as { href: string })?.href.split('?project=')?.[1]))
          .join(''),
      )
      .join(''),
  ).toBe(`${expectWithUrl} ${expectWithUrl} ${expectWithUrl}`)
  expect(resultWithoutUrl).toBe(withoutUrl)
})
