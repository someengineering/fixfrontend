import { NavigateFunction } from 'react-router-dom'
import { createInventorySearchTo } from './createInventorySearchTo'

export const navigateSubtitleQuery = (query: string, change: 'node_compliant' | 'node_vulnerable', navigate: NavigateFunction) =>
  navigate(createInventorySearchTo(`/diff.${change}[*].severity!=null and ${query}`, true))
