import { expectEOF, Lexer, Rule, Token, TokenError, TokenPosition } from 'typescript-parsec'

// A string is parsed into a stream of tokens. All available token kinds are defined in the T enum.
export enum T {
  Space,
  IS,
  ID,
  With, // with
  WithUsage, // with_usage
  Any, // any
  Empty, // empty
  All, // all
  Count, // count
  Not,
  And,
  Or,
  Limit,
  Sort,
  Asc,
  Desc,
  True, // true
  False, // false
  Null, // null
  LParen, // (
  RParen, // )
  LBracket, // [
  RBracket, // ]
  LCurly, // {
  RCurly, // }
  Semicolon, // ;
  DotDot, // ..
  Dot, // .
  Comma, // ,
  Colon, // :
  Float, // 1.0
  Integer, // 1
  Plus, // +
  Minus, // -
  Star, // *
  Slash, // /
  Percent, // %
  Pipe, // |
  Equal, // =
  Tilde, // ~
  NotTilde,
  NotEqual, // !=
  LessThanEqual, // <=
  GreaterThanEqual, // >=
  LessThan, // <
  GreaterThan, // >
  In, // in
  Outbound, // ->
  Inbound, // <-
  Default, // default
  Delete, // delete
  Iam, // iam
  SingleQuotedString, // "abc"
  DoubleQuotedString, // "abc"
  BackTickedString, // `abc`
  Literal, // abc
}

// Simple lexer rules that can be expresses as a regular expression.
// [keep, is_text, regexp, kind]
// keep: if true, the token is kept, if false, the token is discarded
// regexp: the regular expression to match the token
// kind: the token kind to return when the regular expression matches.
//
// Note: we have special rules only for: Literal, SingleQuotedString, DoubleQuotedString
export const FixQueryLexerRules: [boolean, RegExp, T][] = [
  [false, /^\s+/g, T.Space],
  [true, /^is/g, T.IS],
  [true, /^id/g, T.ID],
  [true, /^in/g, T.In],
  [true, /^with/g, T.With],
  [true, /^any/g, T.Any],
  [true, /^empty/g, T.Empty],
  [true, /^all/g, T.All],
  [true, /^count/g, T.Count],
  [true, /^not/g, T.Not],
  [true, /^and/g, T.And],
  [true, /^or/g, T.Or],
  [true, /^limit/g, T.Limit],
  [true, /^sort/g, T.Sort],
  [true, /^asc/g, T.Asc],
  [true, /^desc/g, T.Desc],
  [true, /^true/g, T.True],
  [true, /^false/g, T.False],
  [true, /^null/g, T.Null],
  [true, /^default/g, T.Default],
  [true, /^delete/g, T.Delete],
  [true, /^iam/g, T.Iam],
  [true, /^with_usage/g, T.WithUsage],
  [true, /^\(/g, T.LParen],
  [true, /^\)/g, T.RParen],
  [true, /^\[/g, T.LBracket],
  [true, /^]/g, T.RBracket],
  [true, /^[{]/g, T.LCurly],
  [true, /^[}]/g, T.RCurly],
  [true, /^[.]/g, T.Dot],
  [true, /^[.]{2}/g, T.DotDot],
  [true, /^;/g, T.Semicolon],
  [true, /^,/g, T.Comma],
  [true, /^:/g, T.Colon],
  [true, /^[+-]?[0-9]+\.[0-9]+/g, T.Float],
  [true, /^[+-]?[0-9]+/g, T.Integer],
  [true, /^->/g, T.Outbound],
  [true, /^<-/g, T.Inbound],
  [true, /^[+]/g, T.Plus],
  [true, /^-/g, T.Minus],
  [true, /^\*/g, T.Star],
  [true, /^\//g, T.Slash],
  [true, /^%/g, T.Percent],
  [true, /^\|/g, T.Pipe],
  [true, /^!~/g, T.NotTilde],
  [true, /^~/g, T.Tilde],
  [true, /^=/g, T.Equal],
  [true, /^!=/g, T.NotEqual],
  [true, /^<=/g, T.LessThanEqual],
  [true, /^>=/g, T.GreaterThanEqual],
  [true, /^</g, T.LessThan],
  [true, /^>/g, T.GreaterThan],
]

// Token implementation for the FixLexer
export class LexerToken implements Token<T> {
  private nextToken: LexerToken | undefined | null

  constructor(
    private readonly lexer: FixLexer,
    private readonly input: string,
    public kind: T,
    public text: string,
    public pos: TokenPosition,
    public keep: boolean,
  ) {}

  public get next(): LexerToken | undefined {
    if (this.nextToken === undefined) {
      this.nextToken = this.lexer.parseNextAvailable(this.input, this.pos.index + this.text.length, this.pos.rowEnd, this.pos.columnEnd)
      if (this.nextToken === undefined) {
        this.nextToken = null
      }
    }
    return this.nextToken === null ? undefined : this.nextToken
  }
}

const sw1 = ['is', 'id', 'in', 'with', 'any', 'empty', 'all', 'count', 'not', `with_usage`]
const sw2 = ['and', 'or', 'limit', 'sort', 'asc', 'desc', 'true', 'false', 'null', 'default', 'delete', 'iam']
const sw3 = ['/', '+', '-', '*', '=', '~', '!=', '<=', '>=', '<', '>', '->', '<-']

// Lexer implementation for the FixQuery language
// It uses a static set of rules and can dynamically parse Literals, SingleQuotedStrings and DoubleQuotedStrings.
export class FixLexer implements Lexer<T> {
  private stopWords = [...sw1, ...sw2, ...sw3]
  private alphaCharacters = /[A-Za-z0-9_]/
  private unquotedAllowedStartCharacters = /[A-Za-z0-9_`]/
  private unquotedAllowedCharacters = /[A-Za-z0-9_\-/`\\]/
  private unquotedEndOfUnquotedStr = /[\s,{}()\\[\]<>]/

  public parse(input: string): LexerToken | undefined {
    return this.parseNextAvailable(input, 0, 1, 1)
  }

  public parseNext(input: string, indexStart: number, rowBegin: number, columnBegin: number): LexerToken | undefined {
    if (indexStart === input.length) {
      return undefined
    }
    let result: LexerToken | undefined
    let res: [T, string, number] | undefined
    if (input[indexStart] === '"') {
      res = this.parse_until_next(input, indexStart, T.DoubleQuotedString)
    } else if (input[indexStart] === '`') {
      res = this.parse_until_next(input, indexStart, T.BackTickedString)
    } else if (input[indexStart] === "'") {
      res = this.parse_until_next(input, indexStart, T.SingleQuotedString)
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

  parseNextToken(input: string, indexStart: number, rowBegin: number, columnBegin: number): LexerToken | undefined {
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

  public parseNextAvailable(input: string, index: number, rowBegin: number, columnBegin: number): LexerToken | undefined {
    let token: LexerToken | undefined
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

  parse_until(input: string, startIndex: number, character: string): number | undefined {
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

  parse_until_next(input: string, startIndex: number, kind: T): [T, string, number] | undefined {
    const end = this.parse_until(input, startIndex, input[startIndex])
    if (end) {
      return [kind, input.substring(startIndex, end), end]
    } else {
      return undefined
    }
  }

  parse_unquoted(input: string, startIndex: number): [T, string, number] | undefined {
    let index = startIndex
    let last_is_escape = false
    // Iterate over the input starting from startIndex
    while (index < input.length && this.unquotedAllowedCharacters.test(input[index]) && !this.unquotedEndOfUnquotedStr.test(input[index])) {
      if (input[index] === '`' && !last_is_escape) {
        const backtick = this.parse_until(input, index, '`')
        if (backtick) {
          index = backtick - 1
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
    return [T.Literal, result, index] // Return the result and new index
  }
}

export const lexer = new FixLexer()
export function parse_expr<R>(parser: Rule<T, R>): (expr: string) => R {
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
