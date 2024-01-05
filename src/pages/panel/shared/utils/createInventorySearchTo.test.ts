import { createInventorySearchTo } from './createInventorySearchTo'

test('createInventorySearchTo should return correct uri', () => {
  const kind = 'test'
  const query1 = JSON.stringify(createInventorySearchTo(`is(${kind})`, 'node_compliant'))
  const query2 = JSON.stringify(createInventorySearchTo(`is(${kind})`, 'node_vulnerable'))
  expect(
    query1.startsWith(`{"pathname":"/inventory","search":"?q=is(${kind})&hide=true&before=`) && query1.endsWith('&change=node_compliant"}'),
  ).toBe(true)
  expect(
    query2.startsWith(`{"pathname":"/inventory","search":"?q=is(${kind})&hide=true&before=`) &&
      query2.endsWith('&change=node_vulnerable"}'),
  ).toBe(true)
})
