import { AccountCloud } from 'src/shared/types/server-shared'
import { wordToUFStr } from './snakeCaseToUFStr'

export const getAccountCloudName = (cloud: AccountCloud) => {
  switch (cloud.toLowerCase()) {
    case 'aws':
      return 'AWS'
    case 'azure':
      return 'Azure'
    case 'fix':
      return 'FIX'
    case 'gcp':
      return 'GCP'
    default:
      return wordToUFStr(cloud)
  }
}
