import { expectEOF, Rule } from 'typescript-parsec'
import { FixTokens } from './FixTokens'
import { lexer } from './lexer'

export function parseExpr<R>(parser: Rule<FixTokens, R>): (expr: string) => R {
  function parse(expr: string): R {
    const result = expectEOF(parser.parse(lexer.parse(expr)))
    if (result.successful) {
      return result.candidates[0].result
    } else {
      throw new Error(result.error.message)
    }
  }

  return parse
}
