type ErrorTupleToObject<ErrorMessage, T extends [number, ErrorMessage[]]> = T extends [infer Code, infer Messages]
  ? Code extends number
    ? Messages extends ErrorMessage[]
      ? { status_code: Code; detail: Messages[number] }
      : never
    : never
  : never

export type GenericServerError<T extends [number, ErrorMessage[]][], ErrorMessage = unknown> = {
  [P in keyof T]: T[P] extends [number, ErrorMessage[]] ? ErrorTupleToObject<ErrorMessage, T[P]> : never
}[number]

export type GenericServerErrorWithMessage = {
  message: string
}
