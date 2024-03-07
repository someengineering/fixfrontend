import { Lexer, TokenError, TokenPosition } from 'typescript-parsec'
import { FixQueryLexerRules } from './FixQueryLexerRules'
import { FixTokens } from './FixTokens'
import { LexerToken } from './LexerToken'

const sw1 = ['is', 'id', 'in', 'with', 'any', 'empty', 'all', 'count', 'not']
const sw2 = ['and', 'or', 'limit', 'sort', 'asc', 'desc', 'true', 'false', 'null', 'default', 'delete']
const sw3 = ['/', '+', '-', '*', '=', '~', '!=', '<=', '>=', '<', '>', '->', '<-']

// Lexer implementation for the FixQuery language
// It uses a static set of rules and can dynamically parse Literals, SingleQuotedStrings and DoubleQuotedStrings.
export class FixLexer implements Lexer<FixTokens> {
  private stopWords = [...sw1, ...sw2, ...sw3]
  private alphaCharacters = /[A-Za-z0-9_]/
  private unquotedAllowedStartCharacters = /[A-Za-z0-9_`]/
  private unquotedAllowedCharacters = /[A-Za-z0-9_\-/`\\]/
  private unquotedEndOfUnquotedStr = /[\s,{}()\\[\]<>]/

  public parse(input: string) {
    return this.parseNextAvailable(input, 0, 1, 1)
  }

  public parseNext(input: string, indexStart: number, rowBegin: number, columnBegin: number) {
    if (indexStart === input.length) {
      return undefined
    }
    let result: LexerToken | undefined
    let res: [FixTokens, string, number] | undefined
    if (input[indexStart] === '"') {
      res = this.parseUntilNext(input, indexStart, FixTokens.DoubleQuotedString)
    } else if (input[indexStart] === "'") {
      res = this.parseUntilNext(input, indexStart, FixTokens.SingleQuotedString)
    } else if (this.unquotedAllowedStartCharacters.test(input[indexStart])) {
      res = this.parse_unquoted(input, indexStart)
    }
    if (res) {
      const [kind, text, columnEnd] = res
      const position: TokenPosition = { index: indexStart, rowBegin, columnBegin, rowEnd: rowBegin, columnEnd }
      result = new LexerToken(this, input, kind, text, position, true)
    } else {
      result = this.parseNextToken(input, indexStart, rowBegin, columnBegin)
    }

    if (result === undefined) {
      throw new TokenError(
        { index: indexStart, rowBegin, columnBegin, rowEnd: rowBegin, columnEnd: columnBegin },
        `Unable to tokenize the rest of the input: ${input.substr(indexStart)}`,
      )
    } else {
      return result
    }
  }

  parseNextToken(input: string, indexStart: number, rowBegin: number, columnBegin: number) {
    const subString = input.substring(indexStart)
    let result: LexerToken | undefined
    for (const [keep, regexp, kind] of FixQueryLexerRules) {
      regexp.lastIndex = 0
      if (regexp.test(subString)) {
        const text = subString.substring(0, regexp.lastIndex)
        const columnEnd = columnBegin + text.length
        const position: TokenPosition = { index: indexStart, rowBegin, columnBegin, rowEnd: rowBegin, columnEnd }
        const newResult = new LexerToken(this, input, kind, text, position, keep)
        if (result === undefined || result.text.length < newResult.text.length) {
          result = newResult
        }
      }
    }
    return result
  }

  public parseNextAvailable(input: string, index: number, rowBegin: number, columnBegin: number) {
    let token: LexerToken | undefined
    // eslint-disable-next-line no-constant-condition
    while (true) {
      token = this.parseNext(
        input,
        token === undefined ? index : token.pos.index + token.text.length,
        token === undefined ? rowBegin : token.pos.rowEnd,
        token === undefined ? columnBegin : token.pos.columnEnd,
      )
      if (token === undefined) {
        return undefined
      } else if (token.keep) {
        return token
      }
    }
  }

  parse_until(input: string, startIndex: number, character: string) {
    let index = startIndex + 1
    let last_is_escape = false
    while (index < input.length && (input[index] !== character || last_is_escape)) {
      last_is_escape = input[index] === '\\' && !last_is_escape
      index++
    }
    if (index < input.length && input[index] === character && !last_is_escape) {
      return index + 1
    }
    return undefined
  }

  parseUntilNext(input: string, startIndex: number, kind: FixTokens) {
    const end = this.parse_until(input, startIndex, input[startIndex])
    if (end) {
      return [kind, input.substring(startIndex, end), end] as [FixTokens, string, number]
    } else {
      return undefined
    }
  }

  parse_unquoted(input: string, startIndex: number) {
    let index = startIndex
    let last_is_escape = false
    // Iterate over the input starting from startIndex
    while (index < input.length && this.unquotedAllowedCharacters.test(input[index]) && !this.unquotedEndOfUnquotedStr.test(input[index])) {
      if (input[index] === '`' && !last_is_escape) {
        const backtick = this.parse_until(input, index, '`')
        if (backtick) {
          index = backtick
        } else {
          return undefined
        }
      }
      last_is_escape = input[index] === '\\' && !last_is_escape
      index++
    }
    if (index == startIndex) {
      return undefined
    }
    const result = input.substring(startIndex, index)
    for (const stopWord of this.stopWords) {
      if (result.startsWith(stopWord) && (result.length === stopWord.length || !this.alphaCharacters.test(result[stopWord.length]))) {
        return undefined
      }
    }
    if (!isNaN(parseInt(result))) {
      return undefined
    }
    return [FixTokens.Literal, result, index] as [FixTokens, string, number] // Return the result and new index
  }
}
