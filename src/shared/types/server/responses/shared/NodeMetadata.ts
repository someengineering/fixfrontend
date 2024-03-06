export type NodeMetadata = {
  python_type: string
  cleaned?: boolean
  phantom?: boolean
  protected?: boolean
  replace?: boolean
  exported_at?: string
  descendant_summary?: Record<string, number>
  descendant_count?: number
  exported_age?: string
  provider_link?: string
  [key: string]: unknown
}
