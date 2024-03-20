import { mergeProgressEventParts } from './mergeProgressEventParts'

test('mergeProgressEventParts should merge the events', () => {
  const oldDate = '1970-01-01T00:00:00Z'
  const newDate = new Date().toISOString()
  const ev1 = {
    at: oldDate,
    id: '1',
    kind: 'collect-progress' as const,
    publisher: 'publisher',
    data: {
      task: 'test-task',
      workflow: 'test-workflow',
      message: {
        kind: 'test-kind',
        name: 'test-name',
        parts: [
          { current: 25, total: 50, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '1'] },
          { current: 24, total: 25, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '2'] },
          { current: 75, total: 75, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '3'] },
          { current: 5, total: 65, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '4'] },
          { current: 1, total: 2, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '5'] },
        ],
      },
    },
  }
  const ev2 = {
    at: newDate,
    id: '2',
    kind: 'collect-progress' as const,
    publisher: 'publisher-else',
    data: {
      task: 'test-task-else',
      workflow: 'test-workflow-else',
      message: {
        kind: 'test-kind-else',
        name: 'test-name-else',
        parts: [
          { current: 35, total: 75, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '1'] },
          { current: 40, total: 50, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '2'] },
          { current: 75, total: 80, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '6'] },
          { current: 5, total: 65, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '7'] },
          { current: 1, total: 2, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '5'] },
        ],
      },
    },
  }
  const result = mergeProgressEventParts(ev1, ev2)

  expect(result).toStrictEqual({
    at: newDate,
    id: '1, 2',
    kind: 'collect-progress',
    publisher: 'publisher, publisher-else',
    data: {
      task: 'test-task, test-task-else',
      workflow: 'test-workflow, test-workflow-else',
      message: {
        kind: 'test-kind, test-kind-else',
        name: 'test-name, test-name-else',
        parts: [
          { current: 35, total: 75, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '1'] },
          { current: 40, total: 50, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '2'] },
          { current: 75, total: 80, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '6'] },
          { current: 5, total: 65, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '7'] },
          { current: 1, total: 2, kind: 'another-test-kind-else', name: 'another-test-name-else', path: ['path', 'to', '5'] },
          { current: 75, total: 75, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '3'] },
          { current: 5, total: 65, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '4'] },
        ],
      },
    },
  })
})
