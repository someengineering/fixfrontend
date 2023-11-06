import { adjectives, names, starWars, uniqueNamesGenerator } from 'unique-names-generator'

const howManyAccounts = 61

export const workspaceCloudAccounts = new Array(howManyAccounts).fill({}).map(() => {
  const name = uniqueNamesGenerator({ dictionaries: [names, adjectives, starWars], separator: '-' })
  return {
    id: Math.round(Math.pow(Math.random(), 5) * 1000000000000)
      .toString()
      .padStart(12, '0'),
    name,
    cloud: Math.random() > 0.5 ? 'aws' : 'gcp',
    account_id: name,
    enabled: true,
    is_configured: true,
    resources: Math.round(Math.random() * 10000),
  }
})
