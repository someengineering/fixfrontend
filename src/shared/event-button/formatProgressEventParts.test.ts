import { formatProgressEventParts } from './formatProgressEventParts'

test('formatProgressEventParts should return useful structure for tree view from event parts', () => {
  const parts = [
    { current: 25, total: 50, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '1'] },
    { current: 24, total: 25, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '2'] },
    { current: 75, total: 75, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '3'] },
    { current: 5, total: 65, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '4'] },
    { current: 1, total: 2, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '5'] },
  ]
  const result = formatProgressEventParts(parts, 'test-name')

  expect(result).toStrictEqual({
    name: 'test-name',
    current: 130,
    total: 217,
    path: 'test-name',
    detail: [
      {
        name: 'path',
        path: 'test-name>path',
        current: 130,
        total: 217,
        detail: [
          {
            name: 'to',
            path: 'test-name>path>to',
            current: 130,
            total: 217,
            detail: [
              {
                name: '1',
                path: 'test-name>path>to>1',
                current: 25,
                total: 50,
                detail: [{ name: 'another-test-name', path: 'test-name>path>to>1>another-test-name', current: 25, total: 50 }],
              },
              {
                name: '2',
                path: 'test-name>path>to>2',
                current: 24,
                total: 25,
                detail: [{ name: 'another-test-name', path: 'test-name>path>to>2>another-test-name', current: 24, total: 25 }],
              },
              {
                name: '3',
                path: 'test-name>path>to>3',
                current: 75,
                total: 75,
                detail: [{ name: 'another-test-name', path: 'test-name>path>to>3>another-test-name', current: 75, total: 75 }],
              },
              {
                name: '4',
                path: 'test-name>path>to>4',
                current: 5,
                total: 65,
                detail: [{ name: 'another-test-name', path: 'test-name>path>to>4>another-test-name', current: 5, total: 65 }],
              },
              {
                name: '5',
                path: 'test-name>path>to>5',
                current: 1,
                total: 2,
                detail: [{ name: 'another-test-name', path: 'test-name>path>to>5>another-test-name', current: 1, total: 2 }],
              },
            ],
          },
        ],
      },
    ],
  })
})
