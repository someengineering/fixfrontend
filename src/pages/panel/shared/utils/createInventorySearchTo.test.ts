import { createInventorySearchTo } from './createInventorySearchTo'

test('createInventorySearchTo should return correct uri', () => {
  const kind = 'test'
  const query = JSON.stringify(createInventorySearchTo(`is(${kind})`, true))
  expect(
    query.startsWith(`{"pathname":"/inventory/history","search":"?q=is(${kind})&before=`) &&
      query.endsWith('&changes=node_compliant,node_vulnerable"}'),
  ).toBe(true)
})
