export type RecursiveValueExtractor<T> = T extends object ? { [K in keyof T]: RecursiveValueExtractor<T[K]> }[keyof T] : T
