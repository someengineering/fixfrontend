export interface PostAuthMfaAddResponse {
  secret: string
  recovery_codes: string[]
}
