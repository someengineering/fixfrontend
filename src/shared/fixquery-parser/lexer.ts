import { Lexer, Token, TokenError, TokenPosition } from 'typescript-parsec'

// A string is parsed into a stream of tokens. All available token kinds are defined in the T enum.
export enum T {
  Space,
  IS,
  ID,
  With, // with
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
  SingleQuotedString, // "abc"
  DoubleQuotedString, // "abc"
  Literal, // abc
}

// Simple lexer rules that can be expresses as a regular expression.
// [keep, is_text, regexp, kind]
// keep: if true, the token is kept, if false, the token is discarded
// is_text: if true, the token is not allowed when surrounded by text.
// regexp: the regular expression to match the token
// kind: the token kind to return when the regular expression matches.
//
// Note: we have special rules only for: Literal, SingleQuotedString, DoubleQuotedString
export const FixQueryLexerRules: [boolean, boolean, RegExp, T][] = [
  [false, false, /^\s+/g, T.Space],
  [true, true, /^is/g, T.IS],
  [true, true, /^id/g, T.ID],
  [true, true, /^in/g, T.In],
  [true, true, /^with/g, T.With],
  [true, true, /^any/g, T.Any],
  [true, true, /^empty/g, T.Empty],
  [true, true, /^all/g, T.All],
  [true, true, /^count/g, T.Count],
  [true, true, /^not/g, T.Not],
  [true, true, /^and/g, T.And],
  [true, true, /^or/g, T.Or],
  [true, true, /^limit/g, T.Limit],
  [true, true, /^sort/g, T.Sort],
  [true, true, /^asc/g, T.Asc],
  [true, true, /^desc/g, T.Desc],
  [true, true, /^true/g, T.True],
  [true, true, /^false/g, T.False],
  [true, true, /^null/g, T.Null],
  [true, true, /^default/g, T.Default],
  [true, true, /^delete/g, T.Delete],
  [true, false, /^\(/g, T.LParen],
  [true, false, /^\)/g, T.RParen],
  [true, false, /^\[/g, T.LBracket],
  [true, false, /^]/g, T.RBracket],
  [true, false, /^[{]/g, T.LCurly],
  [true, false, /^[}]/g, T.RCurly],
  [true, false, /^[.]/g, T.Dot],
  [true, false, /^[.]{2}/g, T.DotDot],
  [true, false, /^;/g, T.Semicolon],
  [true, false, /^,/g, T.Comma],
  [true, false, /^:/g, T.Colon],
  [true, false, /^[+-]?[0-9]+\.[0-9]+/g, T.Float],
  [true, true, /^[+-]?[0-9]+/g, T.Integer],
  [true, false, /^->/g, T.Outbound],
  [true, false, /^<-/g, T.Inbound],
  [true, false, /^[+]/g, T.Plus],
  [true, false, /^-/g, T.Minus],
  [true, false, /^\*/g, T.Star],
  [true, false, /^\//g, T.Slash],
  [true, false, /^!~/g, T.NotTilde],
  [true, false, /^~/g, T.Tilde],
  [true, false, /^=/g, T.Equal],
  [true, false, /^!=/g, T.NotEqual],
  [true, false, /^<=/g, T.LessThanEqual],
  [true, false, /^>=/g, T.GreaterThanEqual],
  [true, false, /^</g, T.LessThan],
  [true, false, /^>/g, T.GreaterThan],
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

// Lexer implementation for the FixQuery language
// It uses a static set of rules and can dynamically parse Literals, SingleQuotedStrings and DoubleQuotedStrings.
export class FixLexer implements Lexer<T> {
  private alphaCharacters = /[A-Za-z0-9_]/
  private unquotedAllowedCharacters = /[A-Za-z0-9_\-/`\\]/
  private unquotedEndOfUnquotedStr = /[\s,{}()\\[\]<>]/

  public parse(input: string): LexerToken | undefined {
    return this.parseNextAvailable(input, 0, 1, 1)
  }

  public parseNext(input: string, indexStart: number, rowBegin: number, columnBegin: number): LexerToken | undefined {
    if (indexStart === input.length) {
      return undefined
    }
    let result = this.parseNextToken(input, indexStart, rowBegin, columnBegin)
    if (result === undefined) {
      let res: [T, string, number] | undefined = undefined
      if (input[indexStart] === '"') {
        res = this.parse_until_next(input, indexStart, T.DoubleQuotedString)
      } else if (input[indexStart] === "'") {
        res = this.parse_until_next(input, indexStart, T.SingleQuotedString)
      } else {
        res = this.parse_unquoted(input, indexStart)
      }
      if (res) {
        const [kind, text, columnEnd] = res
        const position: TokenPosition = { index: indexStart, rowBegin, columnBegin, rowEnd: rowBegin, columnEnd }
        result = new LexerToken(this, input, kind, text, position, true)
      }
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
    for (const [keep, is_text, regexp, kind] of FixQueryLexerRules) {
      regexp.lastIndex = 0
      if (regexp.test(subString)) {
        const text = subString.substring(0, regexp.lastIndex)
        const columnEnd = columnBegin + text.length
        const position: TokenPosition = { index: indexStart, rowBegin, columnBegin, rowEnd: rowBegin, columnEnd }
        const newResult = new LexerToken(this, input, kind, text, position, keep)
        if (
          (result === undefined || result.text.length < newResult.text.length) &&
          (!is_text || subString.length == regexp.lastIndex || !this.alphaCharacters.test(subString[regexp.lastIndex]))
        ) {
          result = newResult
        }
      }
    }
    return result
  }

  public parseNextAvailable(input: string, index: number, rowBegin: number, columnBegin: number): LexerToken | undefined {
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
      if (input[index] === '\\' && !last_is_escape) {
        last_is_escape = true
      }
      if (input[index] === '`' && !last_is_escape) {
        const backtick = this.parse_until(input, index, '`')
        if (backtick) {
          index = backtick
        } else {
          return undefined
        }
      }
      index++
    }
    const result = input.substring(startIndex, index)
    return [T.Literal, result, index] // Return the result and new index
  }
}
