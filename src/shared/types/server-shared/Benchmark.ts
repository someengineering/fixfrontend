export interface Benchmark {
  id: string
  title: string
  framework: string
  version: string
  clouds: string[]
  description: string
}

export type BenchmarkDetail =
  | {
      checks: null
      children: BenchmarkDetail[]
      description: string
      documentation: null
      title: string
    }
  | {
      checks: string[]
      children: null
      description: string
      documentation: null
      title: string
    }
